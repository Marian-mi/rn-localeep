import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Input } from '@ui-kitten/components';
import { withNavigation } from 'react-navigation';
import CountDown from 'react-native-countdown-component';
import LottieView from 'lottie-react-native';
import Nav__R from '../../../../../../Fragments/TopNavigations/Yalda/Nav__R';
import Loader from '../../../../../Shared/loader';
import Button from '../../../../../Shared/button';
import Icon from '../../../../../Shared/icon';

import { registerVerificationCode, isValidVerificationCode } from '../../api';

import { colors, baseStyles, dpi } from '../../../../../../global-styles';
import { styles } from './styles';

function VerificationSecondStep_Yalda(props) {
  const navigation = props.navigation;

  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(120);

  const [fieldsStatus, setFieldsStatus] = useState({
    Code: 'basic',
  });

  const validation = {
    Code: 'basic',
  }

  const [formData, setFormData] = useState({
    Code: '',
    Mobile: props.navigation.state.params.mobile
  });

  const person = () => <Icon size={dpi <= 320 ? 20 : 24} color={colors.colorIcons} name="mobile" />;

  const submit = () => {
    let isValid = true;

    if (formData.Code === '') {
      validation.Code = 'empty';
      isValid = false;
    }

    if (isValid) {
      setLoading(true);

      isValidVerificationCode(formData).then((res) => {
        if (res.data)
          navigation.replace("Signup");
        else
          setLoading(false);
      })

    }
    else
      setFieldsStatus(validation);
  }

  const onTimerFinish = () => {
    setCounter(0);
  }

  const onResend = () => {
    registerVerificationCode(formData.Mobile).then((res) => {
      if (res.data == 1) // New
        setCounter(120);
    })
  }

  return (
    <Nav__R title='ثبت کد فعالسازی' backIcon='forward' containerStyle={{ borderBottomWidth: 0 }}>
      {loading
        ? <Loader />
        :
        <ScrollView >
          <View style={styles.container}>
            <View style={styles.formContainer}>

              <View style={styles.animationContainer}>
                <LottieView source={require('../../../../../../../assets/animations/verification-step2.json')} autoPlay loop />
              </View>

              <View style={styles.headingContainer}>
                <Text style={[baseStyles.baseText, { color: colors.colorDefault400 }]}>کد تایید تا لحظاتی دیگر برای شما ارسال خواهد شد در صورت عدم ارسال در تایم مربوطه می توانید از طریق ارسال مجدد، کد مربوطه را به شماره همراه خود ارسال فرمایید.</Text>
              </View>

              <Input
                value={formData.Code}
                style={styles.baseInput}
                textStyle={[baseStyles.baseTextInput, baseStyles.mediumTextInput, baseStyles.textInputPosition]}
                placeholder='کد ارسالی'
                icon={person}
                keyboardType="number-pad"
                onChangeText={value => setFormData({ ...formData, Code: value })}
                status={fieldsStatus.Code != 'basic' && 'danger'}
                caption={''}
              />

              <View style={styles.resendContainer}>
                <Button
                  title="ارسال مجدد کد"
                  wrapperStyle={styles.btnSimpleContainer}
                  containerStyle={styles.btnSimple}
                  textStyle={styles.btnSimpleText}
                  disabled={counter > 0}
                  onPress={onResend}
                  pressInBG={colors.colorInfo400}
                  pressOutBG={colors.colorInfo500}
                />

                {counter > 0 &&
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <CountDown
                      size={dpi <= 320 ? 12 : 15}
                      until={counter}
                      onFinish={onTimerFinish}
                      containerStyle={{ flexDirection: "row-reverse" }}
                      digitStyle={{ backgroundColor: colors.colorDefault500, borderWidth: 2, borderColor: colors.colorDefault400 }}
                      digitTxtStyle={{ color: colors.colorDefault }}
                      timeLabelStyle={{ color: 'red', fontWeight: 'bold' }}
                      separatorStyle={{ color: colors.colorDefault400 }}
                      timeToShow={['M', 'S']}
                      timeLabels={{ m: null, s: null }}
                      showSeparator
                    />
                  </View>
                }
              </View>

              <Button
                title="فعالسازی"
                wrapperStyle={styles.btnSubmitContainer}
                containerStyle={styles.btnSubmit}
                onPress={submit}
                pressInBG={colors.colorSuccess400}
                pressOutBG={colors.colorSuccess500}
              />
            </View>
          </View>

        </ScrollView>
      }
    </Nav__R >
  );
}

export default withNavigation(VerificationSecondStep_Yalda);