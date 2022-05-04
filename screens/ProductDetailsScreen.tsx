import { Entypo } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowBackIcon, Badge, Button, Flex, Heading, HStack, Icon, IconButton, Image, Text, VStack } from 'native-base';
import React, {FC} from 'react';
import { useAppSelector } from '../hooks/redux';
import { MarketStackParamList } from '../types';
import Carousel from 'react-native-snap-carousel';
import { ListRenderItem, ListRenderItemInfo, useWindowDimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../reducers/cartSlice';
import { CartItem } from '../types/Product';




type ProductDetailsScreenProps = NativeStackScreenProps<MarketStackParamList, "Product Detail">


export const ProductDetailsScreen : FC<ProductDetailsScreenProps> = ({navigation, route})=> {
   const product = route.params?.product;
   const { cart} = useAppSelector(({cart})=> ({cart}))
   const { width: windowWidth} = useWindowDimensions();
   const cardWidth = windowWidth * .8;
   const dispatch = useDispatch();
   const renderItem = (item: ListRenderItemInfo<string>) => {
      return(
         <Image source={{uri : item.item}} alt = "productImage" width = {cardWidth} height={cardWidth*5/4}/>
      )
   }
   const onAddToCart = ()=>{
      const cartItem : CartItem = {
         productName: product.name,
         productId: product.productId,
         quantity: 1,
         price: product.price,
         productImage: product.images[0]
      }

      dispatch(addToCart(cartItem));

   }
   return (
      <Flex flex={1} safeArea px = {5} bg="white">
         <Flex
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                py={2}
                px={2}
            >
               <HStack alignItems="center">
               <IconButton size="sm" icon={<ArrowBackIcon/>} onPress={()=> navigation.goBack()} />
                <Heading fontSize="lg">Kopa Market</Heading>

               </HStack>
                <VStack mb = {3}>
                   {
                      cart?.length ?
                      <Badge  colorScheme='red' rounded="full" mb={-4} mr={-4} zIndex={1} variant="solid" alignSelf="flex-end" _text={{fontSize: "xs"}}>
                         {cart.length}
                      </Badge>:
                      null
                   }
                <IconButton
                     onPress={()=> navigation.navigate("Cart") }
                    size="sm"
                    icon={<Icon color="primary.500" size="sm" as={Entypo} name="shopping-cart" />}
                />
                </VStack>
            </Flex>
            <Flex alignItems="center" justifyContent="center">
            <Carousel sliderWidth={cardWidth} itemWidth={cardWidth} data={product.images} renderItem = { renderItem } />
            </Flex>
            <Flex px={5} mt={3}>
            <Heading fontSize="md" my={1}>{product.name}</Heading>
            <Heading my={1}>{`₦${product.price.toLocaleString()}`}</Heading>
            <Text>{product.description}</Text>
            <Badge alignSelf="flex-start" colorScheme='primary' mt={5}>{`${product.quantity} in stock`}</Badge>
            <Button my={5} onPress={onAddToCart}>Add to Cart</Button>
            </Flex>
            
      </Flex>
   )
}