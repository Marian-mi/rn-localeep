import snack from '../../Shared/snackbar';
import { getApi, postApi } from '../../../global-api';

export function getUserOrders(user, data) {
    return postApi({ address: 'Order/GetUserOrders', appData: data, user: user })
        .then(res => {
            if (res.status != 200)
                snack.error('خطا در گرفتن لیست سفارشات.')

            return res;
        })
}

export function cancelOrder(user, orderId) {
    return getApi({ address: 'Order/CancelOrder/' + orderId, user: user })
        .then(res => {
            if (res.status != 200)
                snack.error('خطا در لغو سفارش.')

            return res;
        })
}

export function getBankName(bankPortId) {
    return getApi({ address: 'BankPort/GetBankName/' + bankPortId })
        .then(res => {
            if (res.status != 200)
                snack.error('خطا در گرفتن اطلاعات بانکی.')

            return res;
        })
}