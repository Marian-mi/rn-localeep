import { Input, CheckBox } from '@ui-kitten/components';
import React, { useContext, useState, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { View, Text, ScrollView, BackHandler } from 'react-native';
import { withNavigation } from 'react-navigation';
import RNExitApp from 'react-native-exit-app';
import Modal from "react-native-modal";
import { updateUser } from '../../../../../@Realm/Controllers/user.controller';
import { ShopConfigContext, UserContext } from '../../../../../appContext';
import Nav__R_Cart_Search from '../../../../../Fragments/TopNavigations/Yalda/Nav__R_Cart_Search.js';
import { isValidEmail, isValidMobile, isValidPassword } from '../../../../../utility';
import Icon from '../../../../Shared/icon';
import snack from '../../../../Shared/snackbar';
import Button from '../../../../Shared/button';
import Loader from '../../../../Shared/loader';

import { requestLogin } from '../../api';

import { styles } from './styles';
import { colors, baseStyles, dpi } from '../../../../../global-styles';
import useLocalized from'../../../../../Hooks/useLocalizedStrings';

function Login_Yalda(props) {
  navigation = props.navigation;

  const { strings } = useLocalized();

  const configContext = useContext(ShopConfigContext);
  const userContext = useContext(UserContext);

  const usernameType = configContext.ShopConfigs.LocalConfig.CustomRegister.UsernameType;

  const isLoginBase = configContext.ShopConfigs.LocalConfig.App && configContext.ShopConfigs.LocalConfig.App.Type == "LoginBase";

  const usernameText = usernameType === 'Email' ? strings.email : strings.mobile;

  const LoginIcon = <Icon size={dpi <= 320 ? 16 : 20} color={colors.colorDefault} name="arrow-back" />;

  const UsernameIcon = () =>
    usernameType === 'Email' ? (
      <Icon size={dpi <= 320 ? 20 : 24} color={colors.colorIcons} name="email" />
    ) : (
        <Icon size={dpi <= 320 ? 20 : 24} color={colors.colorIcons} name="mobile" />
      );

  const PasswordIcon = () => <Icon size={dpi <= 320 ? 20 : 24} color={colors.colorIcons} name="lock" />;

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [login, setLogin] = useState({
    username: null,
    password: null,
  });

  const [fieldsStatus, setFieldsStatus] = useState({
    username: 'basic',
    password: 'basic',
  });

  const handleModal = () => {
    setIsModalVisible(!isModalVisible);
  }

  const handleBackButtonClick = () => {
    handleModal();
    return true;
  }

  const handleListener = () => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    navigation.addListener('willBlur', () => BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick));
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const submitLogin = () => {
    setFieldsStatus({
      username: 'basic',
      password: 'basic',
    });

    if (login.username === null) {
      setFieldsStatus({ ...fieldsStatus, username: 'danger' });
      return;
    } else {
      if (usernameType === 'Email') {
        if (isValidEmail(login.username) === false) {
          snack.error(strings.invalidEmailErr);
          return;
        }
      } else {
        if (isValidMobile(login.username) === false) {
          snack.error(strings.invalidMobileErr);
          return;
        }
      }
    }

    if (login.password === null) {
      setFieldsStatus({ ...fieldsStatus, password: 'danger' });
      return;
    } else if (!isValidPassword(login.password)) {
      snack.error(strings.invalidPasswordErr);
      return;
    }

    setIsLoading(true);

    requestLogin({
      Username: login.username,
      Password: login.password,
    }, userContext.User).then(res => {
      setIsLoading(false);

      //its ok , do whatever you want
      if (res.status === 200) {
        userContext.SetUser(res.data);

        updateUser(res.data).then(() => {
          navigation.navigate('Home'); //cant I just go home? :(
          snack.success(strings.welcome);
        });
      }
    });
  };

  const goToRegister = () => {
    if (configContext.ShopConfigs.LocalConfig.App && configContext.ShopConfigs.LocalConfig.App.MobileVerification)
      navigation.navigate('VerificationFirstStep');
    else
      navigation.navigate('Signup');
  }

  useEffect(() => {
    if (isLoginBase)
      handleListener();
  }, []);

  return (
    <Nav__R_Cart_Search title={strings.login} isHidden={isLoginBase}>
      {isLoading ?
        <Loader />
        :
        <>
          <ScrollView contentContainerStyle={styles.masterView}>

            <View style={styles.animationContainer}>
              <LottieView source={require('../../../../../../assets/animations/login.json')} autoPlay loop />
            </View>

            <View style={styles.formContainer}>
              <Input
                value={login.username}
                style={styles.baseInput}
                onChangeText={t => {
                  setLogin({ ...login, username: t });
                }}
                placeholder={usernameText}
                status={fieldsStatus.username}
                icon={UsernameIcon}
                keyboardType={usernameType == "Email" ? "email-address" : "number-pad"}
                caption={
                  fieldsStatus.username === 'danger' &&
                  strings.invalidInput(usernameText)
                }
              />

              <Input
                value={login.password}
                style={styles.baseInput}
                onChangeText={t => {
                  setLogin({ ...login, password: t });
                }}
                placeholder={strings.password}
                status={fieldsStatus.password}
                secureTextEntry={!showPassword}
                icon={PasswordIcon}
                caption={
                  fieldsStatus.password === 'danger' &&
                  strings.enterPassword
                }
              />

              <CheckBox text={strings.showPassword}
                checked={showPassword}
                onChange={toggleShowPassword}
              />

              <Button
                title={strings.forgotPassword}
                wrapperStyle={styles.btnSimpleContainer}
                containerStyle={styles.btnSimple}
                textStyle={styles.btnSimpleText}
                onPress={() => navigation.navigate('ForgettingPassword')}
                pressInBG={colors.colorDefault200}
                pressOutBG={colors.colorDefault}
              />

              <Button
                title={strings.signupAct}
                containerStyle={styles.btnSimple}
                textStyle={styles.btnSimpleText}
                onPress={goToRegister}
                pressInBG={colors.colorDefault200}
                pressOutBG={colors.colorDefault}
              />
            </View>
          </ScrollView>

          <Button
            title={strings.loginAct}
            wrapperStyle={styles.btnSubmitContainer}
            containerStyle={styles.btnSubmit}
            textStyle={styles.btnSubmitText}
            onPress={submitLogin}
            onRenderEndIcon={LoginIcon}
            pressInBG={colors.colorInfo400}
            pressOutBG={colors.colorInfo500}
          />

          <Modal
            isVisible={isModalVisible}
            style={{ alignItems: "center" }}
            animationIn="zoomIn"
            animationInTiming={200}
            backdropTransitionOutTiming={200}
            hideModalContentWhileAnimating={true}
            animationOut="zoomOut"
            animationOutTiming={400}
            useNativeDriver={true} // try adding This line
            onBackdropPress={handleModal}>
            <View style={styles.exitModalContainer}>
              <Text style={[baseStyles.baseText, styles.exitModalText]}>{strings.confirm(strings.exitApp)}</Text>
              <View style={styles.exitModalBtnContainer}>
                <Button
                  title={strings.cancel}
                  onPress={(handleModal)}
                  pressInBG={styles.cancelBtnPressInBG.backgroundColor}
                  pressOutBG={styles.cancelBtnPressOutBG.backgroundColor}
                />
                <Button
                  title={strings.exitAct}
                  onPress={() => RNExitApp.exitApp()}
                  pressInBG={styles.exitBtnPressInBG.backgroundColor}
                  pressOutBG={styles.exitBtnPressOutBG.backgroundColor} />
              </View>
            </View>
          </Modal>
        </>
      }
    </Nav__R_Cart_Search>
  );
}

export default withNavigation(Login_Yalda);
