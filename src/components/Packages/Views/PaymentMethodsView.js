import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCookies } from 'react-cookie';
import isURL from 'validator/lib/isURL';
import PaymentMethod from '../PaymentMethod/PaymentMethod';
import SelectedPackage from '../SelectedPackage/SelectedPackage';
import VoucherView from '../VoucherView/VoucherView';
import { getPaymentUrl } from '../../../scripts/dataHandlers';
import { useMyContext } from '../../../contexts/StateHolder';
import * as classes from './PaymentMethodsView.module.css';

//Does a lot. Shows either paymentMethods or voucher based on users possible payment methods
//if user selected voucher then the voucher view will handle those changes
const PaymentMethodsView = (props) => {
  const { paymentMethods, buyPackageSuccess } = props;

  const { user, organizationId, selectedPackage, userEmail } = useMyContext();

  const [cookies] = useCookies('ea');

  const history = useHistory();

  const [voucherView, setVoucherView] = useState(null);
  const [paymentMethodError, setPaymentMethodError] = useState(null);

  const { t } = useTranslation();
  const { itemType, itemId } = useParams();
  console.log(`itemType`, itemType, itemId);

  const buyPackage = async (methodId, packageId) => {
    let handlerUrl = window.location.protocol + '//' + window.location.hostname;
    handlerUrl += window.location.hostname.includes('localhost')
      ? ':' + window.location.port
      : '';
    handlerUrl += props.settings.returnUrlPath;
    handlerUrl = handlerUrl + `${organizationId}/${itemId}`;
    console.log(`cookies`, cookies);

    try {
      const paymentUrl = await getPaymentUrl(
        cookies?.userData?.userToken,
        organizationId,
        packageId,
        methodId,
        cookies?.ue,
        handlerUrl
      );

      // handlerUrl is return URl in sucess
      //console.log("PP: ", paymentUrl);

      if (
        paymentUrl.status === 'ok' &&
        typeof paymentUrl.redirectUrl !== 'undefined' &&
        isURL(paymentUrl.redirectUrl)
      ) {
        buyPackageSuccess(paymentUrl.redirectUrl);
      } else {
        let errorCode = 19;
        if (
          paymentUrl.status === 'error' &&
          typeof paymentUrl.errorCode !== 'undefined'
        ) {
          errorCode = paymentUrl.errorCode;
        }
        setPaymentMethodError(t('packages.PurchaseErrorCode' + errorCode));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const buyFunction = (methodId, methodKey) => {
    //if user is not logged in.
    //This should never happen cause paymentmethods are disabled when user is not logged in
    // if (!user.loggedIn) {
    //   console.log("Can't buy because needs to log in");
    //   return;
    // }
    //if no selected package then no buy either.
    //This really shouldn't happen either. You shouldn't be able to come here without selecting package
    if (Object.keys(selectedPackage).length === 0) {
      console.log("Can't buy without package");
      return;
    }
    if (methodKey === 'voucher') {
      setVoucherView('active');
    } else {
      buyPackage(methodId, selectedPackage.id);
    }
  };

  const hideVoucher = () => {
    setVoucherView(null);
  };

  const moveToReceipt = () => {
    setVoucherView(null);
    history.push(`/event/${organizationId}/${itemId}`);
    //changePageState("receipt");
    console.log('move to receipt view');
  };

  return (
    <div className={classes.payment}>
      <div className={classes.paymentTitle}>{t('packages.PackagePayment')}</div>
      <SelectedPackage />

      {/* {!user.loggedIn && (
        <div className={classes.paymentUserNotLoggedIn}>
          {t('packages.PackageUserNotLoggedIn')}
        </div>
      )} */}
      {selectedPackage && (
        <div className={classes.paymentMethodsContainer}>
          <div key='title' className={classes.paymentMethodsTitle}>
            {t('packages.PackagePaymentMethods')}
          </div>
          <div className={classes.paymentMethodHelp}>
            {t('packages.PackagePaymentHelp')}
          </div>
          {paymentMethodError && (
            <div className={classes.paymentMethodError}>
              {paymentMethodError}
            </div>
          )}
          {voucherView === null ? (
            <div className={classes.paymentMethods}>
              {Object.values(paymentMethods).map((value) => (
                <PaymentMethod
                  key={value.id}
                  paymentMethod={value}
                  buyFunction={buyFunction}
                />
              ))}
            </div>
          ) : (
            <div className={classes.paymentMethods}>
              <VoucherView
                hideVoucher={hideVoucher}
                moveToReceipt={moveToReceipt}
                selectedPackage={selectedPackage}
              />
            </div>
          )}
          {/* {!user.loggedIn && <div className={classes.paymentHideMethods} />} */}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsView;
