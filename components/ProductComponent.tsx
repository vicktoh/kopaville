import React, {FC} from 'react';
import { useWindowDimensions } from 'react-native';
import {Button, Flex, Heading, Image, Pressable, Text} from 'native-base';
import { CartItem, Product } from '../types/Product';
import { useDispatch } from 'react-redux';
import { addToCart } from '../reducers/cartSlice';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MarketStackParamList } from '../types';

const productFallbackImage = require('../assets/images/placeholder.jpeg');

type ProductComponentProps = {
   product: Product
}

export const ProductComponent : FC<ProductComponentProps> = ({ product })=> {
   const { width: windowWidth, height: windowHeight } = useWindowDimensions();
   const navigation = useNavigation<NavigationProp<MarketStackParamList, "Product Detail">>()
   const dispatch = useDispatch();
   const cardWidth = (windowWidth - 30) / 2;
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
   return(
      <Flex width = {cardWidth} px={2} mb={3}>
         <Pressable my={1} onPress = {()=> navigation.navigate("Product Detail", {product})}>
         <Image width={cardWidth - 10} height={cardWidth * 4/3} fallbackSource={productFallbackImage} source={{uri: product.images[0]}} alt = "Product Image" />
         <Text numberOfLines={1} >{product.name}</Text>
         </Pressable>
         <Heading fontSize="md">{`₦${product.price.toLocaleString()}`}</Heading>
         <Button size="sm" my={2} onPress={onAddToCart}>Add to Cart</Button>
      </Flex>
   )
}