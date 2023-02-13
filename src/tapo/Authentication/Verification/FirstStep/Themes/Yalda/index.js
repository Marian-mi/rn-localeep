import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Input } from '@ui-kitten/components';
import { withNavigation } from 'react-navigation';
import LottieView from 'lottie-react-native';
import Nav__R from '../../../../../../Fragments/TopNavigations/Yalda/Nav__R';
import Loader from '../../../../../Shared/loader';
import Button from '../../../../../Shared/button';
import Icon from '../../../../../Shared/icon';
import { isValidMobile } from '../../../../../../utility';

import { registerVerificationCode } from '../../api';

import { colors, baseStyles, dpi } from '../../../../../../global-styles';
import { styles } from './styles';

function VerificationFirstStep_Yalda(props) {
  const navigation = props.navigation;

  const [loading, setLoading] = useState(false);

  const [fieldsStatus, setFieldsStatus] = useState({
    Mobile: 'basic',
  });

  const validation = {
    Mobile: 'basic',
  }

  const [formData, setFormData] = useState({
    Mobile: '',
  });

  const person = () => <Icon size={dpi <= 320 ? 20 : 24} color={colors.colorIcons} name="mobile" />;

  const submit = () => {
    let isValid = true;

    if (!isValidMobile(formData.Mobile)) {
      validation.Mobile = 'invalidFormat';
      isValid = false;
    }

    if (formData.Mobile === '') {
      validation.Mobile = 'empty';
      isValid = false;
    }

    if (isValid) {
      setLoading(true);

      registerVerificationCode(formData.Mobile).then((res) => {
        if (res.data == 1) // New
          navigation.replace("VerificationSecondStep", { mobile: formData.Mobile });
        else
          setLoading(false);
      })
    }
    else
      setFieldsStatus(validation);
  }

  return (
    <Nav__R title='ثبت شماره همراه جهت فعالسازی' backIcon='forward' containerStyle={{ borderBottomWidth: 0 }}>
      {loading
        ? <Loader />
        :
        <ScrollView >
          <View style={styles.container}>
            <View style={styles.formContainer}>

              <View style={styles.animationContainer}>
                <LottieView source={require('../../../../../../../assets/animations/verification-step1.json')} autoPlay loop />
              </View>

              <View style={styles.headingContainer}>
                <Text style={[baseStyles.baseText, { color: colors.colorDefault400 }]}>شماره همراه وارد شده در مراحل بعدی ثبت نام به عنوان نام کاربری و شماره همراه شما در سیستم ثبت خواهد گردید.</Text>
              </View>

              <Input
                value={formData.Mobile}
                style={styles.baseInput}
                textStyle={[baseStyles.baseTextInput, baseStyles.mediumTextInput, baseStyles.textInputPosition]}
                placeholder='شماره همراه'
                icon={person}
                keyboardType="number-pad"
                onChangeText={value => setFormData({ ...formData, Mobile: value })}
                status={fieldsStatus.Mobile != 'basic' && 'danger'}
                caption={fieldsStatus.Mobile == 'invalidFormat'
                  ? 'فرمت شماره همراه اشتباه می باشد'
                  : ''}
              />

              <Button
                title="ارسال درخواست"
                wrapperStyle={styles.btnSubmitContainer}
                containerStyle={styles.btnSubmit}
                onPress={submit}
                pressInBG={colors.colorInfo400}
                pressOutBG={colors.colorInfo500}
              />
            </View>
          </View>

        </ScrollView>
      }
    </Nav__R >
  );
}

export default withNavigation(VerificationFirstStep_Yalda);