import snack from '../../Shared/snackbar';
import { getApi } from '../../../global-api';

export async function getAddresses(user) {
    return await getApi({ address: 'UserProfile/GetAddresses/' + user.UserId, user: user }).then(res => {
        if (res.status != 200)
            snack.error('خطا در گرفتن لیست آدرس ها')

        return res;
    })
}