import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useMyContext } from '../../contexts/StateHolder';
import {
  getUser,
  getPackages,
  //getShoppingCategories,
  getPaymentMethods,
} from '../../scripts/dataHandlers';

//shows the pages middle, which view is active and probably some other data.
import StateView from './StateView/StateView';

//there 3 are different bottom views
import PackagesView from './Views/PackagesView';
import PaymentMethodsView from './Views/PaymentMethodsView';
import ReceiptView from './Views/ReceiptView';

import * as classes from './PurchaseFlow.module.css';

//expect route to be [asset|event|channel]/ID. Right now it only uses the ID to fetch packages, but maybe later the type matters
//It will only show packages possible to that ID. If path is empty this will show all organization packages.
//Purchase receipt will also arrive here. Receipt route is receipt/packageId. It will behave differently when coming in receipt route
const PurchaseFlow = (props) => {
  const { itemType, itemId } = useParams();

  //this controls which bottom page view is shown
  const [pageState, setPageState] = useState('packages');

  //Shopping categories are not yet used. Maybe never will, but keep it here as a comment until we are sure one way or another
  const {
    packages,
    setPackages,
    //shoppingCategories,
    //setShoppingCategories,
    //selectedPackage,
    setSelectedPackage,
    paymentMethods,
    setPaymentMethods,
    user,
    setUser,
    organizationId,
    language,
  } = useMyContext();
  console.log(`organozationId`, organizationId, language);

  const [cookies] = useCookies('');

  // Holder for profileData
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    country: '',
    countryId: '',
    address: '',
    postalCode: '',
    regionId: '',
    buyerProducts: [],
  });

  //when coming in as receipt then run this
  useEffect(() => {
    if (itemType === 'receipt') {
      setPageState('receipt');
      //setSelectedPackage("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch userdata from API and set it to profileData
  useEffect(() => {
    async function getUserData() {
      try {
        const response = await getUser(
          cookies?.userData?.userToken,
          organizationId
        );

        if (response.status === 200) {
          const newData = {
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            phone: response.data.phone,
            email: response.data.emailAddress,
            city: response.data.city,
            country: response.data.country,
            countryId: response.data.countryId,
            address: response.data.address,
            postalCode: response.data.postalCode,
            regionId: response.data.regionId,
            buyerProducts: response.data.buyerProducts,
          };
          setProfileData({ ...newData });
          if (user.email !== response.data.emailAddress) {
            let modifiedUser = { ...user };
            modifiedUser.eMail = response.data.emailAddress;
            setUser(modifiedUser);
          }
        } else {
          console.log('something wrong with request');
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (organizationId && organizationId > 0 && user && user.userId !== 0) {
      getUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, organizationId]);

  //Fetching organizations packages and payment methods and I know this could be united with the effect above (and probably should)

  // sending an api requet to find the package type( ba)
  useEffect(() => {
    async function getPackagesData() {
      try {
        console.log(itemId);
        let fetchItem = itemType === 'receipt' ? 0 : itemId;
        const responseData = await getPackages(
          organizationId,
          language,
          fetchItem
        );
        console.log(`responseData`, responseData);

        if (
          responseData.status === 'ok' &&
          typeof responseData.packages !== 'undefined'
        ) {
          setPackages(responseData.packages);
        }
      } catch (err) {
        console.log(err);
      }
    }

    /*async function getShoppingCategoriesData() {
      try {
        const responseData = await getShoppingCategories(
          organizationId,
          language
        );

        if (
          responseData.status === "ok" &&
          typeof responseData.shoppingCategories !== "undefined"
        ) {
          setShoppingCategories(responseData.shoppingCategories);
        }
      } catch (err) {
        console.log(err);
      }
    }*/

    async function getPaymentMethodsData() {
      try {
        const responseData = await getPaymentMethods(organizationId);

        if (
          responseData.status === 'ok' &&
          typeof responseData.paymentMethods !== 'undefined'
        ) {
          setPaymentMethods(responseData.paymentMethods);
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (organizationId && organizationId > 0) {
      getPackagesData();
    }

    /*if (
      organizationId &&
      organizationId > 0 &&
      shoppingCategories.length === 0
    ) {
      getShoppingCategoriesData();
    }*/

    if (organizationId && organizationId > 0) {
      getPaymentMethodsData();
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId, language]);

  //used when user selects the package
  const selectPackage = (pkg) => {
    setPageState('payment');
    setSelectedPackage(pkg);
  };

  //used if user decides to go back to packages view
  const changePageState = (newState) => {
    if (pageState !== newState && pageState !== 'receipt') {
      setPageState(newState);
      if (newState !== 'receipt') {
        setSelectedPackage({});
      }
    }
  };

  //successful purchase and move to bank url. Doesn't really need to be here. Could move to paymentMethods view.
  const buyPackageSuccess = (newUrl) => {
    window.location.replace(newUrl);
  };

  //used in receipt view or with page refresh. Sets package value to correct one, so it is shown correctly on page
  const setPackageById = (packageId) => {
    if (pageState === 'receipt' && packages.length > 0) {
      const pkg = packages.find((pkg2) => pkg2.id === packageId);
      if (typeof pkg !== 'undefined') {
        setSelectedPackage(pkg);
      }
    }
  };

  return (
    organizationId && (
      <div className={classes.packageMain}>
        <div className={classes.pageState}>
          <StateView pageState={pageState} changePageState={changePageState} />
        </div>
        {pageState === 'packages' && organizationId && packages && (
          <PackagesView
            buyButtonAction={selectPackage}
            profileData={profileData}
          />
        )}
        {pageState === 'payment' && (
          <PaymentMethodsView
            paymentMethods={paymentMethods}
            buyPackageSuccess={buyPackageSuccess}
            settings={props.settings}
            changePageState={changePageState}
          />
        )}
        {pageState === 'receipt' && (
          <ReceiptView setPackageById={setPackageById} />
        )}
      </div>
    )
  );
};

export default PurchaseFlow;
