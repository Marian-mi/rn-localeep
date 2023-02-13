import React, { useContext, useEffect, useState } from 'react';
import { View, Linking } from 'react-native';
import { NavigationEvents, withNavigation } from 'react-navigation';
import useDidMountEffect from '../../../../../Hooks/useEffectAfterUpdate';
import OrderList from '../../../../../Fragments/OrderList/Yalda';
import Nav__R from '../../../../../Fragments/TopNavigations/Yalda/Nav__R';
import UnAuthorized from '../../../../Shared/401';
import Loader from '../../../../Shared/loader';
import Snack from '../../../../Shared/snackbar';
import { styles } from './styles';

import { UserContext, OrdersContext } from '../../../../../appContext';
import { getUserOrders, cancelOrder, getBankName } from '../../api';

import Config from '../../../../../config';
import useLocalized from '../../../../../Hooks/useLocalizedStrings';

function Orders_Yalda(props) {
    const navigation = props.navigation;
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(true);
    const userContext = useContext(UserContext);
    const ordersContext = useContext(OrdersContext);

    const { strings } = useLocalized();

    const [filters, setFilters] = useState({
        Skip: 0,
        Take: 6,
        UserID: ''
    });

    const refresh = () => {
        setIsLoading(true);

        ordersContext.ResetContext();
        setFilters({ UserID: userContext.User.UserId, Skip: 0, Take: 6 });
    };

    const loadOrders = () => {
        getUserOrders(userContext.User, filters).then(res => {
            if (res.status == 200)
                ordersContext.SetOrders(res.data);

            setIsLoading(false);
        })
    }

    const loadMoreData = () => {
        if (ordersContext.Orders.length < ordersContext.TotalCount)
            setFilters({ ...filters, Skip: filters.Skip + filters.Take });
    }

    const renderFooter = () => {
        return (
            ordersContext.Orders.length < ordersContext.TotalCount
                ? <Loader loadingType="flatlist" />
                : <View></View>
        )
    }

    const onCancelOrder = (orderId) => {
        cancelOrder(userContext.User, orderId).then(() => {
            if (res.status == 200) {
                Snack.success('سفارش شما با موفقیت لغو گردید.');
                ordersContext.CancelOrder(orderId);
            }
        })
    }

    const handlePayment = (params) => {
        switch (params.paymentMethodID) {
            case 1: // CartToCart
            case 2: //  Settle
                navigation.navigate('CartToCart',
                    {
                        orderId: params.orderId,
                        paymentMethodID: params.paymentMethodID,
                        payablePrice: params.payablePrice
                    });
                break;

            case 3: // Online
                getBankName(params.bankPortID).then(res => {
                    if (res.status == 200) {
                        let url = `${Config.BankConnectionPath}${res.data}Bank.aspx?OrderId=${params.orderId}&appOS=android`;
                        Linking.canOpenURL(url).then(supported => {
                            if (supported) {
                                Linking.openURL(url);
                            }
                        });
                    }
                });
                break;

            default:
                break;
        }
    }

    const handleOpenURL = (event) => {
        if (event.url != null)
            navigation.navigate("PaymentCallback", { returnUrl: event.url });
    }

    useEffect(() => {
        Linking.addEventListener('url', handleOpenURL);

        refresh();

    }, []);

    useDidMountEffect(() => {
        loadOrders();
    }, [filters]);

    return (
        <Nav__R title={strings.userOrders}>
            {isLoading ? (
                <Loader />
            ) : isAuthorized ? (
                <>
                    <NavigationEvents onWillFocus={refresh} />
                    <View style={styles.container}>
                        <OrderList
                            orders={ordersContext.Orders}
                            handlePayment={handlePayment}
                            cancelOrder={onCancelOrder}
                            onRenderFooter={renderFooter}
                            onRefreshData={refresh}
                            onLoadMoreData={loadMoreData} />
                    </View>
                </>
            ) : (
                        <UnAuthorized />
                    )}
        </Nav__R>
    );
}

export default withNavigation(Orders_Yalda);
