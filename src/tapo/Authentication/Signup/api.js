import snack from '../../Shared/snackbar';
import { getApi, postApi } from '../../../global-api';
import { Localization } from '../../../global-resources';

export const getStates = () => {
    return getApi({ address: 'Location/GetStates' }).then(res => {
        if (res.status != 200)
            snack.error(Localization.strings.notif.getListError(Localization.strings.state))

        return res;
    })
};

export const getCities = (stateId) => {
    return getApi({ address: 'Location/GetCities/' + stateId }).then(res => {
        if (res.status != 200)
            snack.error(Localization.strings.notif.getListError(Localization.strings.city))

        return res;
    })
};

export function register(data, navigation) {
    return postApi({ address: 'User/Register', appData: data })
        .then(res => {
            if (res.status != 200)
                snack.error(Localization.strings.notif.actError(Localization.strings.signupAct))
            else {
                switch (res.data) {
                    case 0:
                    case 13:
                        snack.success(Localization.strings.notif.actSuccess(Localization.strings.signupAct));
                        navigation.navigate('Login');
                        break;

                    case 1:
                    case 2:
                    case 4:
                    case 5:
                        snack.error(Localization.strings.validation.duplicate(Localization.strings.username));
                        break;

                    case 3:
                        snack.error(Localization.strings.validation.duplicate(Localization.strings.email));
                        break;

                    case 7:
                        snack.error(Localization.strings.validation.invalid(Localization.strings.email));
                        break;

                    case 8:
                        snack.error(Localization.strings.validation.invalid(Localization.strings.password));
                        break;

                    case 9:
                    case 11:
                        snack.error(Localization.strings.validation.invalid(Localization.strings.username));
                        break;

                    case 14:
                        snack.error(Localization.strings.notif.generalSendError);
                        break;

                    case 18:
                        snack.error(Localization.strings.validation.invalid(Localization.strings.displayName));
                        break;

                    case 19:
                        snack.error(Localization.strings.validation.duplicate(Localization.strings.displayName));
                        break;

                    default:
                        snack.error(Localization.strings.notif.actError(Localization.strings.signupAct));
                        break;
                }
            }

            return res;
        })
}