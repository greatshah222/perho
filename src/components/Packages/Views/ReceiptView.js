import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { useCookies } from 'react-cookie';
import SelectedPackage from '../SelectedPackage/SelectedPackage';
import { useMyContext } from '../../../contexts/StateHolder';
import { purchasePackage } from '../../../scripts/dataHandlers';
import * as classes from './ReceiptView.module.css';

const ReceiptView = (props) => {
  const { setPackageById } = props;
  const { itemId } = useParams();
  const history = useHistory();
  const { t } = useTranslation();
  const [purchaseState, setPurchaseState] = useState(null);
  const [purchaseError, setPurchaseError] = useState(null);
  const { packages } = useMyContext();

  const [cookies] = useCookies('');

  useEffect(() => {
    async function purchasePackageData() {
      let params = queryString.parse(window.location.search);
      console.log(params);

      const purchaseResponse = await purchasePackage(
        cookies?.userData?.userToken,
        params
      );
      console.log(purchaseResponse);
      if (purchaseResponse.status === 'ok') {
        setPurchaseState('success');
        setPackageById(parseInt(params.productId));
      } else {
        //27 is double purchase. We will count it as a success still
        if (purchaseResponse.errorCode === 27) {
          setPurchaseState('success');
          setPackageById(params.productId);
          setPurchaseError(
            t('packages.PurchaseErrorCode' + purchaseResponse.errorCode)
          );
        } else {
          setPurchaseState('error');
          setPurchaseError(
            t('packages.PurchaseErrorCode' + purchaseResponse.errorCode)
          );
        }
      }
    }

    //If user used voucher we set success to true.
    function voucherPurchase() {
      setPurchaseState('success');
      setPackageById(parseInt(itemId));
    }

    //VOUCHER CASE. If user is coming with voucher the ItemId should only have numbers
    if (/^\d+$/.test(itemId)) {
      voucherPurchase();

      //RETURN FROM BANK OR SIMILAR
    } else {
      purchasePackageData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //voucher
    if (/^\d+$/.test(itemId)) {
      setPackageById(parseInt(itemId));
      //non voucher
    } else {
      let params = queryString.parse(window.location.search);
      setPackageById(parseInt(params.productId));
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packages]);

  const moveToOriginalPage = () => {
    console.log('moveToOrig');
    console.log(cookies?.packageReturn?.returnPath);
    if (cookies?.packageReturn?.returnPath) {
      history.push(cookies?.packageReturn?.returnPath);
    } else {
      //if no stored path, then return to frontpage
      history.push('/');
    }
  };

  return (
    <div className={classes.receiptView}>
      {purchaseState === 'success' && (
        <>
          <div className={classes.receiptTitle}>
            {t('packages.ReceiptThank')}
          </div>
          <div className={classes.receiptText}>{t('packages.ReceiptText')}</div>
          <SelectedPackage />
          {purchaseError && (
            <div className={classes.receiptFailureMessage}>{purchaseError}</div>
          )}
        </>
      )}
      {purchaseState === 'error' && (
        <>
          <div className={classes.receiptTitle}>
            {t('packages.ReceiptPurchaseFailed')}
          </div>
          <div className={classes.receiptFailureMessage}>{purchaseError}</div>
        </>
      )}
      <div className={classes.receiptReturnPath}>
        <div
          className={classes.receiptReturnButton}
          onClick={() => moveToOriginalPage()}
        >
          {t(
            cookies?.packageReturn?.returnPath
              ? 'packages.ReceiptMoveToOrig'
              : 'packages.ReceiptMoveToFront'
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptView;
