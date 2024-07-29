import React, { FC, useEffect, useMemo, useState } from 'react';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    Button,
    CheckIcon,
    CloseIcon,
    Flex,
    Heading,
    HStack,
    Icon,
    IconButton,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    VStack,
} from 'native-base';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../hooks/redux';
import {
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    setCart,
} from '../reducers/cartSlice';
import { MarketStackParamList } from '../types';
import { CartItem } from '../types/Product';
import { BillingForm } from '../components/BillingForm';
import { PAY_STACK_SK_KEY } from '../constants/Storage';
import * as WebBrowser from 'expo-web-browser';
import { Order } from '../types/Billing';
import { listenOnConfirmedOrder, makeOrder } from '../services/productServices';
import { string } from 'yup';
import { Platform } from 'react-native';
import { Timestamp } from 'firebase/firestore';

const fallbackProductImage = require('../assets/images/placeholder.jpeg');

type CartScreenProps = NativeStackScreenProps<MarketStackParamList, 'Cart'>;

const CartItemComponent: FC<{ item: CartItem; index: number }> = ({
    item: { productImage, price, productName, quantity },
    index,
}) => {
    const dispatch = useDispatch();
    const decrease = () => {
        dispatch(decreaseQuantity(index));
    };
    const increase = () => {
        dispatch(increaseQuantity(index));
    };
    const remove = () => {
        dispatch(removeItem(index));
    };
    return (
        <Flex width="100%">
            <HStack alignItems="center" space={2}>
                <Image
                    alt="product Image"
                    width={102}
                    height={(102 * 3) / 4}
                    source={{ uri: productImage }}
                    fallbackSource={fallbackProductImage}
                />
                <VStack>
                    <Text fontSize="md">{productName}</Text>
                    <Heading fontSize="md">{`₦${price.toLocaleString()}`}</Heading>
                </VStack>
            </HStack>
            <Flex
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                py={2}
            >
                <IconButton
                    onPress={remove}
                    icon={
                        <Icon
                            size="sm"
                            color="red.300"
                            as={Feather}
                            name="trash-2"
                        />
                    }
                />
                <VStack alignItems="center">
                    <Text fontSize="xs">Quantity</Text>
                    <HStack space={3} alignItems="center">
                        <IconButton
                            onPress={decrease}
                            disabled={quantity <= 1}
                            icon={
                                <Icon size="sm" as={AntDesign} name="minus" />
                            }
                        />
                        <Text>{quantity}</Text>
                        <IconButton
                            onPress={increase}
                            icon={<Icon size="sm" as={AntDesign} name="plus" />}
                        />
                    </HStack>
                </VStack>
            </Flex>
        </Flex>
    );
};

export const CartScreen: FC<CartScreenProps> = ({ navigation }) => {
    const { cart, billing, auth } = useAppSelector(
        ({ cart, billing, auth }) => ({ cart, billing, auth })
    );
    const [editBilling, setEditingBilling] = useState<boolean>(false);
    const [checkingOut, setCheckingOut] = useState<boolean>(false);
    const [transactionRef, setTransactionRef] = useState<string>();
    const [orderConfirmed, setOrderConfirmed] = useState<boolean>();
    const dispatch = useDispatch();
    const cartSum = useMemo(() => {
        if (!cart) return 0;
        let total = 0;
        cart.forEach((cartItem) => {
            total += cartItem.price * cartItem.quantity;
        });
        return total;
    }, [cart]);

    useEffect(() => {
        function listenOnOrder() {
            if (transactionRef) {
                const unsub = listenOnConfirmedOrder(
                    transactionRef,
                    (data: any) => {
                        console.log(data);
                        setOrderConfirmed(true);
                        dispatch(setCart(null));
                    }
                );

                return unsub;
            }
        }
        return listenOnOrder();
    }, [transactionRef]);

    const checkout = () => {
        var url = 'https://api.paystack.co/transaction/initialize';
        var bearer = 'Bearer ' + PAY_STACK_SK_KEY;
        setCheckingOut(true);
        fetch(url, {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                Authorization: bearer,
                'X-FP-API-KEY': 'iphone', //it can be iPhone or your any other attribute
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: auth?.email, amount: cartSum * 100 }),
        } as any)
            .then(async (responseJson) => {
                if (!cart) return;
                const res = await responseJson.json();
                const order: Order = {
                    userId: auth?.userId || '',
                    paymentStatus: 'pending',
                    transactionRef: res.data?.reference,
                    cart,
                    date: Timestamp.now(),
                    amount: cartSum,
                    ...(billing ? { billing } : {}),
                };
                await makeOrder(res.data?.reference || '', order);
                setTransactionRef(res?.data?.reference || '');
                setCheckingOut(false);
                WebBrowser.openBrowserAsync(res.data?.authorization_url);
            })
            .catch((error) => console.log(error));
    };

    if (orderConfirmed) {
        return (
            <Flex
                flex={1}
                safeArea
                justifyContent="center"
                alignItems="center"
                px={8}
            >
                <Icon
                    my={2}
                    size="xl"
                    color="primary.400"
                    as={AntDesign}
                    name="checkcircle"
                />
                <Heading textAlign="center" mb={1}>
                    Your order Has been confirmed
                </Heading>
                <Text textAlign="center">
                    Thank you for your purchase monitor the delivery of your
                    products from your orders page
                </Text>
                <Button
                    my={5}
                    variant="solid"
                    onPress={() => {
                        navigation.goBack();
                        navigation.navigate('Orders');
                    }}
                >
                    View Order
                </Button>
            </Flex>
        );
    }

    return (
        <KeyboardAvoidingView
            bg="white"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView bg="white">
                <Flex
                    flex={1}
                    direction="column"
                    safeArea
                    position="relative"
                    bg="white"
                >
                    <IconButton
                        onPress={() => navigation.goBack()}
                        size="sm"
                        position="absolute"
                        right={3}
                        top={3}
                        icon={<Icon as={Entypo} name="cross" />}
                    />

                    <Flex flex={1} px={5}>
                        <Heading my={2}>My Cart</Heading>
                        {cart && cart.length ? (
                            cart.map((cartItem, index) => (
                                <CartItemComponent
                                    item={cartItem}
                                    index={index}
                                    key={`cart-item-${index}`}
                                />
                            ))
                        ) : (
                            <Flex height="lg" width="100%">
                                <Text>You have no item in your cart 🛒</Text>
                            </Flex>
                        )}
                        <VStack my={3}>
                            <Text>Total</Text>
                            <Heading>{`₦${cartSum.toLocaleString()}`}</Heading>
                        </VStack>
                        {!billing || editBilling ? (
                            <BillingForm
                                onSuccess={() => setEditingBilling(false)}
                            />
                        ) : (
                            <Flex
                                borderColor="teal.300"
                                borderRadius="lg"
                                py={3}
                                px={5}
                                borderWidth={1}
                                my={3}
                            >
                                <Heading fontSize="md">Delivery Info</Heading>
                                <Text>{`${billing.address}, ${billing.state}, ${billing.city}`}</Text>
                                <Text fontWeight="bold">{billing.phone}</Text>
                                <IconButton
                                    color="red.200"
                                    onPress={() => setEditingBilling(true)}
                                    size="sm"
                                    icon={
                                        <Icon
                                            size="5"
                                            as={AntDesign}
                                            name="edit"
                                        />
                                    }
                                />
                            </Flex>
                        )}
                        {cart && cart.length && billing ? (
                            <Button isLoading={checkingOut} onPress={checkout}>
                                Checkout
                            </Button>
                        ) : null}
                    </Flex>
                </Flex>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
