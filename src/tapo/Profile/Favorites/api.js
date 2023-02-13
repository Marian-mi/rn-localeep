import snack from '../../Shared/snackbar';
import { getApi } from '../../../global-api';

export function getUserFavorites(user) {
    return getApi({ address: 'Favorite/GetUserFavorites/' + user.UserId, user: user })
        .then(res => {
            if (res.status != 200)
                snack.error('خطا در گرفتن لیست علاقه مندی ها.')

            return res;
        })
}