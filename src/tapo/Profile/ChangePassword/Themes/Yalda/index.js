import React, { useContext, useState } from 'react';
import { Input, CheckBox } from '@ui-kitten/components';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import Nav__R from '../../../../../Fragments/TopNavigations/Yalda/Nav__R';
import Button from '../../../../Shared/button';
import Loader from '../../../../Shared/loader';
import Icon from '../../../../Shared/icon';
import Snack from '../../../../Shared/snackbar';
import { isValidPassword } from '../../../../../utility';

import { styles } from './styles';
import { baseStyles, colors, dpi } from '../../../../../global-styles';

import { UserContext } from '../../../../../appContext';
import { changePassword } from '../../api';
import useLocalized from '../../../../../Hooks/useLocalizedStrings';

function ChangePassword_Yalda(props) {
    const navigation = props.navigation;
    const [isLoading, setIsLoading] = useState(false);
    const userContext = useContext(UserContext);
    const [showPassword, setShowPassword] = React.useState(false);

    const { strings } = useLocalized()

    const [fieldsStatus, setFieldsStatus] = useState({
        OldPassword: 'basic',
        NewPassword: 'basic',
        NewPasswordConfirm: 'basic',
    });

    const validation = {
        OldPassword: 'basic',
        NewPassword: 'basic',
        NewPasswordConfirm: 'basic',
    }

    const [formData, setFormData] = useState({
        UserID: userContext.User.UserId,
        OldPassword: '',
        NewPassword: '',
        NewPasswordConfirm: '',
    });

    const key = () => <Icon size={dpi <= 320 ? 20 : 24} color={colors.colorIcons} name="key" />;

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const submit = () => {
        let isValid = true;

        if (!isValidPassword(formData.OldPassword)) {
            validation.OldPassword = 'invalidPassword';
            isValid = false;
        }

        if (!isValidPassword(formData.NewPassword)) {
            validation.NewPassword = 'invalidPassword';
            isValid = false;
        }

        if (formData.NewPassword == formData.OldPassword) {
            validation.NewPassword = 'similarPassword';
            isValid = false;
        }

        if (formData.NewPassword != formData.NewPasswordConfirm) {
            validation.NewPasswordConfirm = 'invalidPasswordConfirm';
            isValid = false;
        }

        if (isValid) {
            setIsLoading(true);

            changePassword(userContext.User, formData).then((res) => {
                setIsLoading(false);

                if (res.status == 200) {
                    switch (res.data) {
                        case 1: // success
                            setTimeout(() => {
                                navigation.goBack();
                                Snack.success(strings.notif.updateSuccess(strings.password));
                            }, 100);
                            break;

                        case 2: // wrong old password
                            Snack.error(strings.validation.invalid(strings.oldPassword));
                            break;

                        default:
                            Snack.error(strings.notif.updateError(strings.password));
                            break;
                    }
                }
            })
        }
        else
            setFieldsStatus(validation);
    }

    return (
        <Nav__R title={strings.changePassword}>
            {isLoading
                ? <Loader />
                :
                <>
                    <View style={styles.container}>
                        <Input
                            value={formData.OldPassword}
                            style={styles.baseInput}
                            textStyle={[baseStyles.baseTextInput, baseStyles.mediumTextInput, baseStyles.textInputPosition]}
                            placeholder={`${strings.oldPassword} ${strings.required}`}
                            icon={key}
                            secureTextEntry={!showPassword}
                            onChangeText={value => setFormData({ ...formData, OldPassword: value })}
                            status={fieldsStatus.OldPassword != 'basic' && 'danger'}
                            caption={fieldsStatus.OldPassword == 'invalidPassword'
                                && strings.validation.password}
                            captionStyle={baseStyles.baseInputCaption}
                        />

                        <Input
                            value={formData.NewPassword}
                            style={styles.baseInput}
                            textStyle={[baseStyles.baseTextInput, baseStyles.mediumTextInput, baseStyles.textInputPosition]}
                            placeholder={`${strings.newPassword} ${strings.required}`}
                            icon={key}
                            secureTextEntry={!showPassword}
                            onChangeText={value => setFormData({ ...formData, NewPassword: value })}
                            status={fieldsStatus.NewPassword != 'basic' && 'danger'}
                            caption={fieldsStatus.NewPassword == 'invalidPassword'
                                ?
                                strings.validation.password
                                : fieldsStatus.NewPassword == 'similarPassword'
                                    ?
                                    strings.validation.samePassword
                                    : ''
                            }
                            captionStyle={baseStyles.baseInputCaption}
                        />

                        <Input
                            value={formData.NewPasswordConfirm}
                            style={styles.baseInput}
                            textStyle={[baseStyles.baseTextInput, baseStyles.mediumTextInput, baseStyles.textInputPosition]}
                            placeholder={`${strings.repeatNewPassword} ${strings.required}`}
                            icon={key}
                            secureTextEntry={!showPassword}
                            onChangeText={value => setFormData({ ...formData, NewPasswordConfirm: value })}
                            status={fieldsStatus.NewPasswordConfirm != 'basic' && 'danger'}
                            caption={fieldsStatus.NewPasswordConfirm == 'invalidPasswordConfirm'
                                && strings.validation.confirmPassword}
                            captionStyle={baseStyles.baseInputCaption}
                        />

                        <CheckBox text={strings.showPassword} checked={showPassword} onChange={toggleShowPassword} />

                        <Button
                            title={strings.submit}
                            pressInBG={colors.colorSuccess400}
                            pressOutBG={colors.colorSuccess600}
                            onPress={submit}
                            containerStyle={styles.saveBtn} />
                    </View>
                </>
            }
        </Nav__R>
    );
}

export default withNavigation(ChangePassword_Yalda);
