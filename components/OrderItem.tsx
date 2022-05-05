import React, { FC } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Badge, Flex, Heading, HStack, Icon, Pressable, Text, VStack } from 'native-base';
import { Order } from '../types/Billing';

type OrderItemProps = {
    order: Order;
    onSelect: () => void;
};

export const OrderItem: FC<OrderItemProps> = ({ order, onSelect }) => {
    const date = format(order.date as Date, 'd MMM yyyy');
    return (
        <Pressable onPress={onSelect}>
            <Flex
                borderRadius="lg"
                borderWidth={1}
                borderColor="primary.300"
                py={5}
                px={3}
                position="relative"
            >
                <Heading fontSize="lg">{`Order: ${
                    order.transactionRef || 'no-ref'
                }`}</Heading>
                <Flex direction="row" justifyContent="space-between" mt={3}>
                <HStack space={2} alignItems="center">
                    <Icon size="sm" as={AntDesign} name="shoppingcart" />
                    <Text>{`${order.cart.length} items`}</Text>
                </HStack>
                <VStack>
                   <Text fontSize="xs">Delivery Status</Text>
                   <Badge colorScheme='warning'>{order?.deliveryStatus || "pending"}</Badge>
                </VStack>
                </Flex>
                
                <Text
                    fontSize="sm"
                    color="primary.400"
                    position="absolute"
                    right={2}
                    top={2}
                >
                    {date}
                </Text>
            </Flex>
        </Pressable>
    );
};
