import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckIcon, CloseIcon, Flex, Heading, HStack, Icon, IconButton, Image, ScrollView, Text, VStack } from 'native-base';
import React, {FC} from 'react';
import { useAppSelector } from '../hooks/redux';
import { MarketStackParamList } from '../types';
import { CartItem } from '../types/Product';

const fallbackProductImage = require('../assets/images/placeholder.jpeg');


type CartScreenProps = NativeStackScreenProps<MarketStackParamList, "Cart">

const CartItemComponent : FC<{item: CartItem, index: number}> = ({item: {productImage, price, productName, quantity}, index})=> {

   return (
      <Flex width="100%">
         <HStack alignItems="center" space={2}>
            <Image alt = "product Image" width={102} height={102 * 3/4} source={{uri: productImage}} fallbackSource= {fallbackProductImage} />
            <VStack>
               <Text fontSize="md">{productName}</Text>
               <Heading fontSize="md">{price.toLocaleString()}</Heading>
            </VStack>
         </HStack>
         <Flex direction='row' alignItems="center" justifyContent="space-between" py={2}>
            <IconButton icon={<Icon size="sm" color="red.300" as = {Feather} name = "trash-2" />} />
            
            <HStack space={3} alignItems="center">
               <IconButton disabled={quantity<=1} icon = {<Icon size="sm" as = {AntDesign} name = "minus" />} />
               <Text>{quantity}</Text>
               <IconButton disabled={quantity<=1} icon = {<Icon size="sm" as = {AntDesign} name = "plus" />} />

            </HStack>
         </Flex>

      </Flex>
   )
}

export const CartScreen : FC = ()=> {
   const {cart} = useAppSelector(({cart})=> ({cart}))
   return(
      <Flex flex = {1} safeArea position="relative" bg="white">
         <IconButton size="sm" position="absolute" right={3} top={3} icon = {<Icon as = {Entypo} name = "cross"  />} />

         <Flex flex={1} px={5}>
            <Heading my={2}>My Cart</Heading>
            <ScrollView flex = {1} bg = "white">
               {
                  cart && cart.length ? (
                     cart.map((cartItem, index)=> (
                        <CartItemComponent item={cartItem} index={index} key = {`cart-item-${index}`} />
                     ))
                  ):
                  <Flex height="lg" width="100%">
                     <Text>You have no item in your cart 🛒</Text>
                  </Flex>
               }

            </ScrollView>
         </Flex>
      </Flex>
   )
}