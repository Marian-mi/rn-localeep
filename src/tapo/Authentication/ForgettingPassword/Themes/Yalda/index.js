import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Input } from '@ui-kitten/components';
import { withNavigation } from 'react-navigation';
import LottieView from 'lottie-react-native';
import Nav__R_Cart from '../../../../../Fragments/TopNavigations/Yalda/Nav__R_Cart';
import Loader from '../../../../Shared/loader';
import Button from '../../../../Shared/button';
import Icon from '../../../../Shared/icon';
import { sendPasswordAlert } from '../../../../Shared/static-data';
import { isValidEmail, isValidMobile } from '../../../../../utility';
import { ShopConfigContext } from '../../../../../appContext';

import { sendPassword } from '../../api';

import { colors, baseStyles, dpi, isRtl } from '../../../../../global-styles';
import importedStyles from './styles';
import useLocalized from '../../../../../Hooks/useLocalizedStrings';

function ForgettingPassword_Yalda(props) {
  const navigation = props.navigation;
  const configContext = useContext(ShopConfigContext);
  const isLoginBase = configContext.ShopConfigs.LocalConfig.App && configContext.ShopConfigs.LocalConfig.App.Type == "LoginBase";

  const [extraData, setExtraData] = useState({
    IsSendSuccessfully: false,
    AlertText: sendPasswordAlert()
  });
  const [loading, setLoading] = useState(false);

  let styles = importedStyles(extraData.IsSendSuccessfully);

  const [fieldsStatus, setFieldsStatus] = useState({
    Username: 'basic',
  });

  const validation = {
    Username: 'basic',
  }

  const [formData, setFormData] = useState({
    Username: '',
  });

  const { strings } = useLocalized()

  const person = () => <Icon size={dpi <= 320 ? 20 : 24} color={colors.colorIcons} name="person" />;

  const submit = () => {
    let isValid = true;

    if (formData.Username.includes("@")) {
      if (!isValidEmail(formData.Username)) {
        validation.Username = 'invalidFormat';
        isValid = false;
      }
    }
    else {
      if (!isValidMobile(formData.Username)) {
        validation.Username = 'invalidFormat';
        isValid = false;
      }
    }

    if (formData.Username === '') {
      validation.Username = 'empty';
      isValid = false;
    }

    if (isValid) {
      setLoading(true);
      sendPassword(formData).then((res) => {
        if (res.status == 200 && res.data.CanSend)
          setExtraData({ IsSendSuccessfully: res.data.CanSend, AlertText: res.data.Message })
        setLoading(false);
      })

    }
    else
      setFieldsStatus(validation);
  }

  return (
    <Nav__R_Cart isHidden={isLoginBase} title={strings.recoverPassword} backIcon={isRtl ? 'forward' : 'back'} containerStyle={{ borderBottomWidth: 0 }}>
      {loading
        ? <Loader />
        :
        <ScrollView >
          <View style={styles.container}>
            <View style={styles.formContainer}>

              <View style={styles.animationContainer}>
                <LottieView source={require('../../../../../../assets/animations/login.json')} autoPlay loop />
              </View>

              <View style={styles.headingContainer}>
                <Text style={[baseStyles.baseText, { color: colors.colorDefault400 }]}>{extraData.AlertText}</Text>
              </View>
              {
                !extraData.IsSendSuccessfully
                  ?
                  <>
                    <Input
                      value={formData.Username}
                      style={styles.baseInput}
                      textStyle={[baseStyles.baseTextInput, baseStyles.mediumTextInput, baseStyles.textInputPosition]}
                      placeholder={strings.userNameHinted}
                      icon={person}
                      keyboardType="number-pad"
                      onChangeText={value => setFormData({ ...formData, Username: value })}
                      status={fieldsStatus.Username != 'basic' && 'danger'}
                      caption={fieldsStatus.Username == 'invalidFormat'
                        ? strings.validation.invalid(strings.username)
                        : ''}
                    />

                    <Button
                      title={strings.sendRequest}
                      wrapperStyle={styles.btnSubmitContainer}
                      containerStyle={styles.btnSubmit}
                      onPress={submit}
                      pressInBG={colors.colorInfo400}
                      pressOutBG={colors.colorInfo500}
                    />
                  </>
                  :
                  <Button
                    title={strings.backToPage(strings.loginAct)}
                    wrapperStyle={styles.btnSubmitContainer}
                    containerStyle={styles.btnSubmit}
                    onPress={() => navigation.goBack()}
                    pressInBG={colors.colorInfo400}
                    pressOutBG={colors.colorInfo500}
                  />
              }
            </View>
          </View>

        </ScrollView>
      }
    </Nav__R_Cart >
  );
}

export default withNavigation(ForgettingPassword_Yalda);