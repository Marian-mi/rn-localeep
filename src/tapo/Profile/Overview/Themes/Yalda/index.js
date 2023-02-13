import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import Nav__R from '../../../../../Fragments/TopNavigations/Yalda/Nav__R.js';
import Loader from '../../../../Shared/loader';
import { deleteUser } from '../../../../../@Realm/Controllers/user.controller';
import ProfileItem from '../../../../../Fragments/ProfileItem/Yalda';

import { styles } from './styles';

import { UserContext, ShopConfigContext } from '../../../../../appContext';
import useLocalized from '../../../../../Hooks/useLocalizedStrings.js';

function ProfileOverview_Yalda(props) {
    const navigation = props.navigation;
    const userContext = useContext(UserContext);
    const configContext = useContext(ShopConfigContext);
    const [isLoading, setIsLoading] = useState(false);

    const { strings } = useLocalized()

    const signout = () => {
        setIsLoading(true);
        setTimeout(() => {
            userContext.SetUser({});

            deleteUser().then(() => {
                if (configContext.ShopConfigs.LocalConfig.App && configContext.ShopConfigs.LocalConfig.App.Type == "LoginBase")
                    navigation.navigate('Login', { goBack: false });
                else
                    navigation.navigate('Home');
            })
        }, 500);
    }

    return (
        <Nav__R title={strings.userProfile} containerStyle={{ borderBottomWidth: 0 }}>
            {isLoading ? <Loader />
                :
                <View style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Text style={[styles.baseText, styles.displayNameText]}>{userContext.User.DisplayName}</Text>
                        <Text style={[styles.baseText, styles.usernameText]}>{userContext.User.Username}</Text>
                    </View>
                    <View style={styles.itemsContainer}>
                        <ProfileItem navigateTo='EditBasicInfo' iconName='edit' title={strings.personalInfo} />
                        <ProfileItem navigateTo='Orders' iconName='ballot' title={strings.userOrders} />
                        <ProfileItem navigateTo='ProfileFavorites' iconName='favorite' title={strings.userFavorites} />
                        <ProfileItem navigateTo='ProfileAddresses' iconName='location' title={strings.userAddresses} />

                        {configContext.ShopConfigs.SuperUserConfig.SCORING_SYSTEM.IsEnable &&
                            <ProfileItem navigateTo='ProfileScores' iconName='collections-bookmark' title={strings.userPoints} />
                        }

                        <ProfileItem navigateTo='ChangePassword' iconName='key' title={strings.changePassword} />
                        <ProfileItem onPress={signout} iconName='exit' title={strings.exitAct} />
                    </View>
                </View>
            }
        </Nav__R>
    );
}

export default withNavigation(ProfileOverview_Yalda)