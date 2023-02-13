import snack from '../../Shared/snackbar';
import { postApi } from '../../../global-api';
import { Localization } from '../../../global-resources';

export function requestLogin(data, user) {
  return postApi({ address: `/User/Validate4App`, appData: data, user: user })
    .then(res => {
      if (res.status == 401)
        snack.error(Localization.strings.wrongUserOrPass)
      else if (res.status != 200 && res.status != 401)
        snack.error(Localization.strings.notif.actError(Localization.strings.signin))
      return res;
    })
}
