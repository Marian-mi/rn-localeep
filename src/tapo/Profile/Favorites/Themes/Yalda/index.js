import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationEvents, withNavigation } from 'react-navigation';
import Nav__R from '../../../../../Fragments/TopNavigations/Yalda/Nav__R';
import UnAuthorized from '../../../../Shared/401';
import Button from '../../../../Shared/button';
import Loader from '../../../../Shared/loader';
import ProductList from '../../../../../Fragments/ProductList/Yalda';

import { styles } from './styles';

import { UserContext } from '../../../../../appContext';
import { getUserFavorites } from '../../api';


function ProfileFavorites_Yalda(props) {
    const navigation = props.navigation;

    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(true);
    const [favorites, setFavorites] = useState([]);

    const userContext = useContext(UserContext);

    useEffect(() => {
        refresh();
    }, [])

    const refresh = () => {
        setIsLoading(true);

        getUserFavorites(userContext.User).then(res => {
            if (res.status == 200)
                setFavorites(res.data);
                
            setIsLoading(false);
        });
    }

    return (
        <Nav__R title="لیست مورد علاقه من">
            {isLoading ? (
                <Loader />
            ) : isAuthorized ? (
                <>
                    <NavigationEvents onWillFocus={refresh} />
                    <View style={styles.container}>
                        <ProductList navigation={navigation}
                            products={favorites}
                            onRefreshData={refresh}
                            loading={isLoading}
                            boxWidth="49%"
                        />
                    </View>
                </>
            ) : (
                        <UnAuthorized />
                    )}
        </Nav__R>
    );
}

export default withNavigation(ProfileFavorites_Yalda);
