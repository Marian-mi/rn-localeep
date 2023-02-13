import snack from '../../Shared/snackbar';
import { getApi, postApi } from '../../../global-api';

export function getUserScores(user, data) {
    return postApi({ address: 'UserScore/GetUserScores', appData: data, user: user })
        .then(res => {
            if (res.status != 200)
                snack.error('خطا در گرفتن لیست گزارش امتیازات.')

            return res;
        })
}

export function getUserScore(user) {
    return getApi({ address: 'UserProfile/GetUserScore/' + user.UserId, user: user }).then(res => {
        if (res.status != 200)
            snack.error('خطا در گرفتن امتیاز کاربر.')

        return res;
    })
}