import snack from '../../../Shared/snackbar';
import { getApi } from '../../../../global-api';

export const registerVerificationCode = (param) => {
  return getApi({ address:`Verification/RegisterVerificationCode/${param}`})
    .then(res => {
      if (res.status != 200)
        snack.error('خطا در ارسال کد تایید.');
      else if (res.data == 1) // New
        snack.success('کد تایید برای شما ارسال خواهد شد.');
      else if (res.data == 2)
        snack.error('شما قبلا با این شماره همراه ثبت نام کرده اید.');
      else if (res.data == 3)
        snack.error('تا پایان مدت زمان مشخص امکان ارسال مجدد کد تایید وجود ندارد.');
      else if (res.data == 4)
        snack.error('خطا در ارسال کد تایید.');

      return res;
    })
};