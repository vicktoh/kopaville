import { Entypo } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowBackIcon, Badge, Box, Button, CloseIcon, FlatList, Flex, Heading, HStack, Icon, IconButton, Image, KeyboardAvoidingView, ScrollView, Text, useDisclose } from 'native-base';
import React, {FC, useEffect, useState} from 'react';
import { ActivityIndicator, ListRenderItemInfo, Modal, Platform } from 'react-native';
import { OrderItem } from '../components/OrderItem';
import { useAppSelector } from '../hooks/redux';
import { fetchOrders } from '../services/productServices';
import { MarketStackParamList } from '../types';
import { Order } from '../types/Billing';
import { CartItem } from '../types/Product';
const defaultProductImage = require("../assets/images/placeholder.jpeg")



type OrderScreenProps = NativeStackScreenProps<MarketStackParamList, "Orders">
type CartOrderItem = CartItem & {deliveryStatus?: 'shipped' | 'pending'| 'delivered'}
const OrderCartItem : FC<{item: CartOrderItem }> = ({item: {productName, quantity, deliveryStatus = 'pending', productImage}}) => {
   return(
      <Box mb={2} borderBottomWidth={1} py={3} borderBottomColor="secondary.300">
         <Heading fontSize="md" my={2}>{productName}</Heading>
         <Image alt = "product image" width={50} height={50*4/3} source = {{uri: productImage}} fallbackSource={defaultProductImage}/>
         <HStack alignItems="center" space = {3}>
         <Text>{`Qty: ${quantity}`}</Text>
         <Badge >{deliveryStatus}</Badge>
         </HStack>
      </Box>
   )
}



export const OrderScreen: FC<OrderScreenProps> = ({navigation, route})=> {
   const auth = useAppSelector(({auth})=> auth)
   const [loading, setLoading] = useState<boolean>(true);
   const [orders, setOrders] = useState<Order[]>();
   const {onClose: onCloseCartView, isOpen:isCartViewOpen, onOpen: onOpenCartView} = useDisclose();
   const [selectedOrder, setSelectedOrder] = useState<Order>();

   useEffect(()=>{
      async function getOrders(){
         const data = await fetchOrders(auth?.userId || "");
         setLoading(false);
         setOrders(data);
      }
      getOrders()
   }, []);

   const viewCartItems = (order: Order)=>{
      setSelectedOrder(order);
      onOpenCartView();

   }

   const renderOrderItems = (item: ListRenderItemInfo<Order> )=>{
      return(
         <OrderItem order={item.item} onSelect={()=> viewCartItems(item.item) } />
      )
   }

   const renderOrderCartItem = (item: ListRenderItemInfo<CartOrderItem>) => {
      return(
         <OrderCartItem item={item.item} />
      )
   }
   return(
      <Flex bg="white" safeArea px={5} flex={1}>
               <IconButton size= "sm" onPress={()=> navigation.goBack()} icon = {<ArrowBackIcon/>} my={2} />
               <Heading my = {2}>My orders</Heading>
               {
                  loading && !orders ? 
                  <Flex flex={1} justifyContent="center" alignSelf="center">
                     <ActivityIndicator />
                  </Flex>:
                  orders?.length ? 
                  <FlatList data={orders} renderItem = {renderOrderItems} keyExtractor = {(item)=> item.transactionRef} /> :
                  <Flex flex={1}  justifyContent="center" alignItems="center">
                     <Heading textAlign="center">You don't have any orders</Heading>
                     <Text textAlign="center">Go to the Kopa Market to buy a wide range of products</Text>
                     <Button my = {5} onPress = {()=> navigation.goBack()} >Go to Kopa Market</Button>
                  </Flex>
               }
               <Modal visible={isCartViewOpen} animationType="slide">
                  <Flex flex={1}  bg="white" borderRadius="lg" py={5} px={8} safeArea>
                     <IconButton onPress={onCloseCartView} alignSelf="flex-end" size="sm" icon = {<Icon size="sm" as = {Entypo} name = "cross" />} />

                  {
                     selectedOrder ?
                     <>
                     <Heading my={5}>Order Items: {selectedOrder.transactionRef}</Heading>
                     <FlatList data = {selectedOrder.cart} renderItem = {renderOrderCartItem} keyExtractor ={(item, index)=> item?.productId || `cartItem-${index}`} />
                     </> 
                     :
                     <Flex flex={1} justifyContent="center" alignItems="center">
                        <Text>🛒 No Items this order</Text>
                     </Flex>
                  }
                  </Flex>
                  
               </Modal>
      </Flex>
   )
}