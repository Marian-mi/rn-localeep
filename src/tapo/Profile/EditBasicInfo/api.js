import snack from '../../Shared/snackbar';
import { postApi, getApi } from '../../../global-api';

export function getProfileFields(user) {
    return getApi({ address: 'UserProfile/GetProfileFields/' + user.UserId, user: user })
        .then(res => {
            if (res.status != 200)
                snack.error('خطا در گرفتن اطلاعات کاربر.')

            return res;
        })
}

export function updateProfile(user, data) {
    return postApi({ address: 'UserProfile/UpdateProfile/', appData: data, user: user })
        .then(res => {
            if (res.status != 200)
                snack.error('خطا در ویرایش اطلاعات.')

            return res;
        })
}