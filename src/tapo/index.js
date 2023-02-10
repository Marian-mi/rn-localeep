import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, Image, useWindowDimensions, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { Axios } from '../../../App';
import ProductContext from '../../ContextProviders/ProductContext';
import Carousel from '../../Fragments/Carousel/Carousel';
import ProductList from '../../Fragments/ProductList/ProductList';
import { BoxStyles, Colors, Flex } from '../../Styles/Index';
import ProductPageHeader from '../../Fragments/Headers/ProductPage';
import RenderHtml from 'react-native-render-html'
import DotsLoader from '../../Fragments/Loaders/DotsLoader';
import { AppHelper } from '../../config';
import { ProductPageApi } from './Api';
import { Styles } from './Styles';

const ProductPage = ({ route }) => {
    const { product, setProducts, isFetching } = useContext(ProductContext);

    const { ID } = route.params

    const { width } = useWindowDimensions();
    const [scrollY, setScrollY] = useState(0)

    const Api = useRef(new ProductPageApi(setProducts)).current

    useLayoutEffect(() => {
        setProducts((ps) => ({ ...ps, isFetching: true }))
    }, [])

    useEffect(() => {
        Api.loadProduct(ID)
    }, [])

    if (isFetching) return <DotsLoader /> 

    const renderItem = item => {
        return (
            <PureView key={item.Path} style={{ width: width }}>
                <Image source={{ uri: AppHelper.MapToServerPath(item.Path), width: width, height: width }} />
            </PureView>
        );
    };


    return (
        <ScrollView onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)} stickyHeaderIndices={[0]}>
            <ProductPageHeader title={product.Title.Main} scrollY={scrollY} />
            <View style={{ position: "relative", zIndex: 0 }}>
                <Carousel data={product.ProductImages.BigGallery ?? product.ProductImages} renderer={renderItem} keyExtractor={(item) => item.Path} />
                <Title title={product.Title.Main} />
                <View style={{ padding: 20 }}>
                    <Buttons />
                    <View style={Styles.Details}>
                        <View style={Styles.Description}>
                            <RenderHtml
                                source={{ html: product.Description }}
                                contentWidth={300}
                            />
                        </View>
                        <Text style={Styles.Price}>{product?.Prices?.NewPrice ?? "----"} {product?.Prices?.PriceUnit}</Text>
                        <Text style={Styles.Score}>با خرید این کالا ۴۰ عدد گیشانتیون دریافت میکنید</Text>

                        <View style={Styles.AddtoCart}>
                            <Icon name="cart-plus" size={32} color={'white'} />
                            <Text style={{ marginStart: 20, color: 'white', fontSize: 18, fontFamily: "Samim" }}>افزودن به سبد خرید</Text>
                        </View>
                    </View>
                </View>
                <Text>
                    {"افزودن به سبد خرید"}






                    
                    </Text>
                <ProductList
                    products={product.SimilarProducts}
                    title={"محصولات مشابه"}
                />
                <ProductList
                    products={product.RelatedProducts}
                    title={"محصولات مرتبط"}
                />
            </View>
        </ScrollView>
    );
};

export const PureView = React.memo(({ children }) => <View>{children}</View>);

const Title = ({ title }) => (
    <View style={[Styles.Title]}>
        <View style={[Flex.Row, { justifyContent: 'flex-end' }]}>
            <Icon name="heart" size={26} color={Colors.Grey} style={{ marginEnd: 15 }} />
            <Icon name="share-variant" size={26} color={Colors.Grey} />
        </View>
        <Text style={Styles.TitleText}>{title}</Text>
    </View>
);

const Buttons = () => (
    <View style={Flex.Row}>
        <Pressable style={Styles.Button}>
            <Icon name="comment-multiple" size={22} color={Colors.Grey} />
            <Text style={Styles.ButtonLabel}>نظرات کاربران</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable style={Styles.Button}>
            <Icon name="clipboard-text-outline" size={26} color={Colors.Grey} />
            <Text style={Styles.ButtonLabel}>مشخصات</Text>
        </Pressable>
    </View>
);



export default ProductPage;
