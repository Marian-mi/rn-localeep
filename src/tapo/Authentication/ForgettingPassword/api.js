import snack from '../../Shared/snackbar';
import { postApi } from '../../../global-api';

export function sendPassword(data) {
  return postApi({ address: `/User/SendPassword`, appData: data })
    .then(res => {
      if (!res.data.CanSend)
        snack.error(res.data.Message);

      return res;
    })
}
