import React, { FC, useEffect, useState } from 'react';
import {
   Badge,
    Button,
    Divider,
    FlatList,
    Flex,
    FormControl,
    Heading,
    Icon,
    IconButton,
    PresenceTransition,
    ScrollView,
    Slider,
    Text,
    VStack,
} from 'native-base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MarketStackParamList } from '../types';
import { Entypo } from '@expo/vector-icons';
import { useAppSelector } from '../hooks/redux';
import { CategoryCard } from '../components/CategoryCard';
import { Product, ProductFilter } from '../types/Product';
import { fetchProducts } from '../services/productServices';
import { ActivityIndicator, ListRenderItemInfo } from 'react-native';
import { Category } from '../types/Category';
import { ProductComponent } from '../components/ProductComponent';

type ExploreMarketScreenProps = NativeStackScreenProps<
    MarketStackParamList,
    'Market'
>;

export const ExploreMarket: FC<ExploreMarketScreenProps> = ({
    navigation,
    route,
}) => {
    const { categories, auth, cart } = useAppSelector(({ categories, auth, cart }) => ({
        categories,
        auth,
        cart
    }));
    const [showCategories, setShowCategories] = useState<boolean>(false);
   
    const [filter, setFilter] = useState<ProductFilter>({});
    const [productLoading, setProductLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>();
    useEffect(() => {
        async function getProducts() {
            setProductLoading(true);
            const prods = await fetchProducts(filter);
            setProductLoading(false);
            setProducts(prods);
        }
        getProducts();
    }, [filter]);

   
    const onSelectCategory = (category: string) => {
        setFilter({ category });
    };
    const renderCategoryCard = (item: ListRenderItemInfo<Category>) => {
        return (
            <CategoryCard category={item.item} onSelect={onSelectCategory} />
        );
    };

    const renderProductCard = (item: ListRenderItemInfo<Product>) => {
        return <ProductComponent product={item.item} />;
    };

    const onClearCategory = () => {
        setFilter({ category: undefined });
    };
    return (
        <Flex flex={1} safeArea px={5}>
            <Flex
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                py={2}
                px={2}
            >
                <Heading fontSize="lg">Kopa Market</Heading>
                <VStack>
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
            

            {filter?.category ? (
                <Flex direction='row' justifyContent="space-between" alignItems="center">
                    <Heading fontSize="sm" mb={1}>{`Showing ${
                        categories.map[filter.category]
                    }`}</Heading>
                    <Button
                        onPress={onClearCategory}
                        variant="link"
                        fontSize="xs"
                    >
                        Clear Filter
                    </Button>
                </Flex>
            ) : (
                <>
                    <Heading fontSize="md" mb={3}>
                        Categories
                    </Heading>
                    <FlatList
                        flex={1}
                        maxHeight={125}
                        data={categories?.categories || []}
                        renderItem={renderCategoryCard}
                        keyExtractor={(item) => item.categoryId}
                        horizontal
                    />
                </>
            )}

            {productLoading ? (
                <Flex flex={1} alignItems="center" justifyContent="center">
                    <ActivityIndicator />
                </Flex>
            ) : products?.length ? (
               <Flex flex = {1} mt={2}>
                  <Heading fontSize="md" mb={5}>Products</Heading>
                <FlatList
                     flex={1}
                    numColumns={2}
                    data={products}
                    keyExtractor={(item, i) => item.productId || `product-${i}`}
                    renderItem={renderProductCard}
                />
                </Flex>
            ) : (
                <Flex></Flex>
            )}
        </Flex>
    );
};
