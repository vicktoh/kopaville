import { Box, Flex, Image, Pressable, Text } from 'native-base';
import React, {FC} from 'react';
import { Category } from '../types/Category';

const categoryPlaceHolder = require('../assets/images/placeholder.jpeg');


type CategoryCardProps = {
   category: Category
   onSelect: (category:string) => void;
}

export const CategoryCard: FC<CategoryCardProps> = ({ category, onSelect })=> {

   return(
      <Pressable mr={3} onPress= {()=> onSelect(category.categoryId) }>
         <Box  bg="primary.100">
         <Image alt = "categoryImage" src = {category.avartar} width={120} height={120*3/4} fallbackSource={categoryPlaceHolder} />
         </Box>
         <Text mt={2} fontSize="md">{category.title}</Text>
      </Pressable>
   )
}