import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCookies } from 'react-cookie';
import { voucherPurchase } from '../../../scripts/dataHandlers';
import { useMyContext } from '../../../contexts/StateHolder';
import { useForm } from '../../../Shared/Hooks/form-hook';
import { Input } from '../../../Shared/Input/Input';
import { VALIDATOR_REQUIRE } from '../../../Shared/Validation/Validator';
import * as classes from './VoucherView.module.css';
import Button from '../../../Shared/Button/Button';

const VoucherView = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(['']);

  const { hideVoucher, moveToReceipt, selectedPackage } = props;
  const [apiError, setApiError] = useState(null);
  const { t } = useTranslation();
  const { organizationId, language } = useMyContext();

  const [state, InputHandler] = useForm(
    {
      VOUCHERCODE: {
        value: '',
        isValid: false,
      },
    },
    false
    // the last false defines if the whole form is valid or not ( since we have set all isvalid to false so our total form validity will also be false)
  );

  const voucherButtonAction = async () => {
    console.log(cookies, cookies?.ue);
    const voucherPurchaseResponse = await voucherPurchase(
      cookies?.ue,
      language,
      organizationId,
      selectedPackage.id,
      state.inputs.VOUCHERCODE.value,
      1,
      cookies?.ue
    );

    //console.log("VPR:", voucherPurchaseResponse);

    if (voucherPurchaseResponse.data.status === 'ok') {
      setApiError(null);
      // we have to set the event tickets in cookie
      setCookie('tiAcc', voucherPurchaseResponse?.data?.tickets[0], {
        path: '/',
      });

      moveToReceipt();
    } else {
      setApiError(
        getErrorMsgTranslation(voucherPurchaseResponse.data.errorCode)
      );
    }
  };

  const getErrorMsgTranslation = (errorCode) => {
    return t('packages.VoucherErrorCode' + errorCode);
  };

  return (
    <>
      <div className={classes.voucherTitle}>{t('packages.VoucherTitle')}</div>
      <div className={classes.voucherInput}>
        <Input
          id='VOUCHERCODE'
          label='VOUCHERCODE'
          placeholder={t('packages.GiveVoucherCode')}
          type='text'
          element='input'
          validators={[VALIDATOR_REQUIRE()]}
          errorText={t('packages.VoucherCheckCode')}
          onInput={InputHandler}
          iconName='ticket-alt'
        />
      </div>
      {apiError !== null && (
        <div className={classes.voucherApiError}>{apiError}</div>
      )}
      <div className={classes.voucherButtons}>
        <div
          className={classes.voucherButton}
          id='okButton'
          name='okButton'
          onClick={() => voucherButtonAction()}
        >
          <Button
            className={classes.voucherOkButtonText}
            disabled={!state.isValid}
          >
            {t('packages.Ok')}
          </Button>
        </div>
        <div
          className={classes.voucherButton}
          id='cancelButton'
          name='cancelButton'
          onClick={() => hideVoucher()}
        >
          <Button className={classes.voucherOkButtonText} inverse>
            {t('packages.Cancel')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default VoucherView;
