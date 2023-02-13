import snack from '../../Shared/snackbar';
import { postApi } from '../../../global-api';

export function changePassword(user, data) {
    return postApi({ address: 'UserProfile/ChangePassword', appData: data, user: user })
        .then(res => {
            if (res.status != 200)
                snack.error('خطا در تغییر رمز عبور.')

            return res;
        })
}