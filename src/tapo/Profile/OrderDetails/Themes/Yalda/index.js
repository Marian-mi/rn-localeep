import React, { useContext, useEffect, useState } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { NavigationEvents, withNavigation } from 'react-navigation';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Nav__R from '../../../../../Fragments/TopNavigations/Yalda/Nav__R';
import GeneralInfo from '../../../../../Fragments/OrderDetails/GeneralInfo/Yalda';
import OrderItems from '../../../../../Fragments/OrderDetails/OrderItems/Yalda';
import PaymentInfo from '../../../../../Fragments/OrderDetails/PaymentInfo/Yalda';
import UnAuthorized from '../../../../Shared/401';
import Loader from '../../../../Shared/loader';
import Snack from '../../../../Shared/snackbar';
import { helper } from '../../../../../utility';

import { styles } from './styles';

import { UserContext, OrderDetailsContext } from '../../../../../appContext';
import { getOrder } from '../../api';
import useLocalized from '../../../../../Hooks/useLocalizedStrings';

const initialLayout = { width: Dimensions.get('window').width };

function OrderDetails_Yalda(props) {
    const navigation = props.navigation;
    const orderId = navigation.getParam('orderId');

    const { strings } = useLocalized()

    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(true);
    const [index, setIndex] = useState(0);
    const [routes] = React.useState([
        { key: 'generalInfo', title: strings.generalInfo },
        { key: 'orderItems', title: strings.orderItems },
        { key: 'paymentInfo', title: strings.paymentInfo },
    ]);

    const renderScene = SceneMap({
        generalInfo: GeneralInfo,
        orderItems: OrderItems,
        paymentInfo: PaymentInfo
    });

    const userContext = useContext(UserContext);
    const orderContext = useContext(OrderDetailsContext);

    useEffect(() => {
        getOrder(userContext.User, orderId).then(res => {
            if (res.status == 200) {
                res.data.PaymentMethods = helper.format4Select(res.data.PaymentMethods, 'ID', 'Title');
                orderContext.SetOrder(res.data);
            }

            setIsLoading(false);
        })
    }, []);

    return (
        <Nav__R title={strings.orderDetails} containerStyle={{ borderBottomWidth: 0 }}>
            {isLoading ? (
                <Loader />
            ) : isAuthorized ? (
                <>
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        renderTabBar={props =>
                            <TabBar
                                style={styles.tabbar}
                                tabStyle={styles.tab}
                                pressOpacity={1}
                                indicatorStyle={styles.indicator}
                                renderLabel={({ route, focused, color }) => (
                                    <Text style={[styles.tabLabel, { color, focused }]}>
                                        {route.title}
                                    </Text>
                                )}
                                {...props} />}
                        onIndexChange={setIndex}
                        initialLayout={initialLayout}
                    />
                </>
            ) : (
                        <UnAuthorized />
                    )}
        </Nav__R>
    );
}

export default withNavigation(OrderDetails_Yalda);
