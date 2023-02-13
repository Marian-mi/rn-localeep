import React, { useContext, useRef, useState, useEffect } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { CheckBox } from "@ui-kitten/components"
import { Input } from "@ui-kitten/components"
import SlidingUpPanel from "rn-sliding-up-panel"
import useDidMountEffect from "../../../../Hooks/useEffectAfterUpdate"
import Loading from "../../../Shared/loader"
import Button from "../../../Shared/button"
import Icon from "../../../Shared/icon"
import CartList from "../../../../Fragments/CartList/Yalda"
import Nav__R_Cart from "../../../../Fragments/TopNavigations/Yalda/Nav__R_Cart"

import { colors, baseStyles, dpi } from "../../../../global-styles"
import { styles } from "./styles"

import { CartContext, ShopConfigContext, UserContext } from "../../../../appContext"
import OrderItemDescription from "../../../../Fragments/OrderItemDescription"
import { useLocalized } from "react"

export default function Cart(props) {
    const { strings } = useLocalized()
    const cartContext = useContext(CartContext)
    const configContext = useContext(ShopConfigContext)
    const userContext = useContext(UserContext)
    const floatingPanel = useRef(null)

    const [visible, setVisible] = useState(false)
    const [discountCode, setDiscountCode] = useState(null)

    const discountIcon = () => <Icon color={colors.colorDefault400} name="gift" size={dpi <= 320 ? 19 : 22} />

    const handlePanel = () => {
        setVisible(!visible)
    }

    useDidMountEffect(() => {
        if (visible) floatingPanel.current.show()
        else floatingPanel.current.hide()
    }, [visible])

    return (
        <Nav__R_Cart title={strings.yourCart} backIcon="close" navigation={props.navigation}>
            {props.isLoading ? (
                <Loading />
            ) : (
                <>
                    {configContext.ShopConfigs.SuperUserConfig.COUPON && cartContext.Cart.Items.length != 0 && (
                        <View style={styles.topFixContainer}>
                            <Input
                                value={cartContext.Cart.DiscountCode != null ? cartContext.Cart.DiscountCode : discountCode}
                                style={styles.discountInput}
                                textStyle={[baseStyles.baseTextInput, baseStyles.smallTextInput]}
                                placeholder={strings.discountCoupon}
                                disabled={cartContext.Cart.DiscountCode != null ? true : false}
                                icon={discountIcon}
                                onChangeText={setDiscountCode}
                            />

                            <Button
                                title={cartContext.Cart.DiscountCode != null ? strings.deleteCoupon : strings.submitCoupon}
                                pressInBG={colors.colorPrimary400}
                                pressOutBG={colors.colorPrimary500}
                                containerStyle={styles.discountBtn}
                                textStyle={styles.btnText}
                                onPress={() => props.onValidateDiscountCode(discountCode)}
                            />
                        </View>
                    )}

                    {configContext.ShopConfigs.SuperUserConfig.SCORING_SYSTEM.IsEnable &&
                        cartContext.Cart.Items.length != 0 &&
                        userContext.User.UserId != undefined && (
                            <View style={styles.scoreContainer}>
                                <CheckBox
                                    status="primary"
                                    style={styles.checkboxContainer}
                                    checked={cartContext.Cart.IsUseScore}
                                    onChange={(isCheck) => props.onUseScore(isCheck)}
                                />

                                <Text style={styles.scoreText}>
                                    {strings.useScores}
                                    {userContext.User.UserScore}
                                </Text>
                            </View>
                        )}

                    <View style={styles.mainContainer}>
                        <CartList
                            onCartUpdate={props.onCartUpdate}
                            onCartDelete={props.onCartDelete}
                            onOrderDescrpitionPress={props.onOrderDescrpitionPress}
                            cartItems={cartContext.Cart.Items}
                        />
                    </View>

                    {cartContext.Cart.Items.length != 0 && (
                        <>
                            <View style={styles.bottomFixContainer}>
                                <Button
                                    title={strings.checkout}
                                    containerStyle={styles.confirmBtn}
                                    textStyle={styles.btnText}
                                    onPress={props.onHandleCheckout}
                                    pressInBG={colors.colorSuccess400}
                                    pressOutBG={colors.colorSuccess600}
                                />

                                <TouchableOpacity style={styles.totalPriceContainer} activeOpacity={1} onPress={handlePanel}>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={styles.basePriceText}>{strings.totalPrice}</Text>
                                        <Icon
                                            color={colors.colorDefault400}
                                            style={styles.totalPriceIcon}
                                            name="arrow-up"
                                            size={dpi <= 320 ? 16 : 20}
                                        />
                                    </View>
                                    <Text style={styles.basePriceText}>
                                        {cartContext.Cart.FormattedPayablePrice} {cartContext.Cart.Items[0].PriceUnit}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <SlidingUpPanel
                                friction={0.4}
                                height={100}
                                draggableRange={{ top: dpi <= 320 ? 226 : 244, bottom: 0 }}
                                allowDragging={false}
                                showBackdrop={false}
                                ref={floatingPanel}
                            >
                                <View style={styles.floatingPanel}>
                                    <View style={[styles.priceContainer, styles.priceSeperator]}>
                                        <Text style={styles.basePriceText}>قیمت کل</Text>
                                        <Text style={[styles.basePriceText, styles.priceText]}>
                                            {cartContext.Cart.Items[0].TotalPrice} {cartContext.Cart.Items[0].PriceUnit}
                                        </Text>
                                    </View>
                                    <View style={[styles.priceContainer, styles.priceSeperator]}>
                                        <Text style={styles.basePriceText}>{strings.totalDiscount}</Text>
                                        <Text style={[styles.basePriceText, styles.priceText]}>
                                            {cartContext.Cart.FormattedTotalDiscount} {cartContext.Cart.Items[0].PriceUnit}
                                        </Text>
                                    </View>
                                    <View style={[styles.priceContainer, styles.priceSeperator]}>
                                        <Text style={styles.basePriceText}>{strings.postalPrice}</Text>
                                        <Text style={[styles.basePriceText, styles.priceText]}>
                                            {cartContext.Cart.PostalPrice > 0
                                                ? cartContext.Cart.FormattedPostalPrice +
                                                  " " +
                                                  cartContext.Cart.Items[0].PriceUnit
                                                : "---"}
                                        </Text>
                                    </View>
                                    <View style={[styles.priceContainer, styles.priceSeperator]}>
                                        <Text style={styles.basePriceText}>{strings.payablePrice}</Text>
                                        <Text style={[styles.basePriceText, styles.priceText]}>
                                            {cartContext.Cart.FormattedPayablePrice} {cartContext.Cart.Items[0].PriceUnit}
                                        </Text>
                                    </View>
                                </View>
                            </SlidingUpPanel>
                        </>
                    )}

                    {configContext.ShopConfigs.SuperUserConfig.ORDER_DESC_IN_PRODUCT_PAGE.IsEnable && (
                        <OrderItemDescription
                            cartItemId={props.orderDescription.cartItemId}
                            modalVisibleSetter={props.orderDescription.visible}
                            onBackDropPress={props.onModalBackDropPress}
                        />
                    )}
                </>
            )}
        </Nav__R_Cart>
    )
}
