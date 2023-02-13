import snack from '../../Shared/snackbar';
import { getApi } from '../../../global-api';

export function getOrder(user, orderId) {
    return getApi({ address: 'Order/Get4App/' + orderId, user: user })
        .then(res => {
            if (res.status != 200)
                snack.error('خطا در گرفتن اطلاعات سفارش.')

            return res;
        })
}