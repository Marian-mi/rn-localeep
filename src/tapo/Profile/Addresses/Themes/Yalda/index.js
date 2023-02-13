import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationEvents, withNavigation } from 'react-navigation';
import AddressList from '../../../../../Fragments/AddressList/Yalda';
import Nav__R from '../../../../../Fragments/TopNavigations/Yalda/Nav__R';
import Button from '../../../../Shared/button';
import Loader from '../../../../Shared/loader';

import { colors } from '../../../../../global-styles';
import { styles } from './styles';

import { AddressesContext, UserContext } from '../../../../../appContext';
import { getAddresses } from '../../api';
import useLocalized from '../../../../../Hooks/useLocalizedStrings';


function ProfileAddresses_Yalda(props) {
    const navigation = props.navigation;
    const [isLoading, setIsLoading] = useState(true);
    const addressesContext = useContext(AddressesContext);
    const userContext = useContext(UserContext);

    const { strings } = useLocalized()

    const goToForm = () => {
        navigation.navigate('AddressForm');
    };

    const refresh = () => {
        setIsLoading(true);
        
        getAddresses(userContext.User)
            .then(res => {
                if (res.status == 200) {
                    addressesContext.SetAddresses(res.data);
                    setIsLoading(false);
                } else
                    setIsLoading(false);
            })
    };

    useEffect(() => {
        refresh();
    }, []);

    return (
        <Nav__R title={strings.userAddresses}>
            {isLoading ?
                <Loader />
                :
                <>
                    <NavigationEvents onWillFocus={refresh} />
                    <View style={styles.btnContainer}>
                        <Button
                            pressInBG={colors.colorSuccess400}
                            pressOutBG={colors.colorSuccess600}
                            title={strings.newAddressAct}
                            onPress={goToForm}
                            containerStyle={styles.btn}
                        />
                    </View>
                    <AddressList addressSelection={false} addresses={addressesContext.Addresses} />
                </>
            }
        </Nav__R>
    );
}

export default withNavigation(ProfileAddresses_Yalda);
