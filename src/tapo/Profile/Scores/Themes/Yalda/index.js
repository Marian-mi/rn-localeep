import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import ScoreList from '../../../../../Fragments/ScoreList/Yalda';
import Nav__R from '../../../../../Fragments/TopNavigations/Yalda/Nav__R';
import Loader from '../../../../Shared/loader';
import useDidMountEffect from '../../../../../Hooks/useEffectAfterUpdate';

import { styles } from './styles';
import { baseStyles, colors } from '../../../../../global-styles';

import { UserScoresContext, UserContext } from '../../../../../appContext';
import { getUserScores, getUserScore } from '../../api';

function ProfileScores_Yalda(props) {
    const navigation = props.navigation;
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState(0);
    const userScoresContext = useContext(UserScoresContext);
    const userContext = useContext(UserContext);
    const affiliateCode = userContext.User.UserId;

    const [filters, setFilters] = useState({
        Skip: 0,
        Take: 20,
        UserID: ''
    });

    const refresh = () => {
        setIsLoading(true);

        userScoresContext.ResetContext();
        setFilters({ UserID: userContext.User.UserId, Skip: 0, Take: 20 });
    };

    const loadUserScores = () => {
        getUserScores(userContext.User, filters).then(res => {
            if (res.status == 200)
                userScoresContext.SetUserScores(res.data);

            setIsLoading(false);
        })
    }

    const loadMoreData = () => {
        if (userScoresContext.UserScores.length < userScoresContext.TotalCount)
            setFilters({ ...filters, Skip: filters.Skip + filters.Take });
    }

    const renderFooter = () => {
        return (
            userScoresContext.UserScores.length < userScoresContext.TotalCount
                ? <Loader loadingType="flatlist" />
                : <View></View>
        )
    }

    useEffect(() => {
        getUserScore(userContext.User).then(res => {
            if (res.status == 200)
                setScore(res.data);
        })

        refresh();
    }, []);

    useDidMountEffect(() => {
        loadUserScores();
    }, [filters]);

    return (
        <Nav__R title="امتیازهای من">
            {isLoading ?
                <Loader />
                :
                <View style={styles.container}>
                    <View style={styles.alertContainer}>
                        <Text style={[baseStyles.baseText, styles.infoTextColor]}>
                            امتیاز مربوط به سفارش زمانی به حساب شما منظور می شود که پرداخت موفق باشد.{"\n"}
                            امتیاز مربوط به معرف زمانی که اولین خرید موفق توسط ایشان ثبت شود به حساب شما منظور خواهد شد.{"\n"}
                            همچنین در صورت تایید نظر شما توسط مدیر امتیاز مربوط به ثبت نظر در محصول نیز برای شما ثبت خواهد شد.
                        </Text>
                        <View style={styles.alertScoreContainer}>
                            <Text style={[baseStyles.baseText, styles.infoTextColor, styles.scoreText]}>امتیازات من : {score}</Text>
                            <Text style={[baseStyles.baseText, styles.infoTextColor]}>کد معرف من : {affiliateCode}</Text>
                        </View>
                    </View>
                    <ScoreList
                        scores={userScoresContext.UserScores}
                        onRenderFooter={renderFooter}
                        onRefreshData={refresh}
                        onLoadMoreData={loadMoreData} />
                </View>
            }
        </Nav__R>
    );
}

export default withNavigation(ProfileScores_Yalda);
