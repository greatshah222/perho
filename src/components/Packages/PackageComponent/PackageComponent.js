import { useTranslation } from 'react-i18next';
import { convertCurrency } from '../../../scripts/utils';
import * as classes from './PackageComponent.module.css';
import { useMyContext } from '../../../contexts/StateHolder';
import Modal from 'react-modal';
import { useState } from 'react';
import { Input } from '../../../Shared/Input/Input';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_PASSWORDMATCH,
  VALIDATOR_REQUIRE,
} from '../../../Shared/Validation/Validator';
import { useForm } from '../../../Shared/Hooks/form-hook';
import { useCookies } from 'react-cookie';
import Button from '../../../Shared/Button/Button';

//shows single package information. Doesn't handle ticket packages or f-liiga single event purchase packages yet.
const PackageComponent = ({ pkg, buyButtonAction, userPackages }) => {
  const { t } = useTranslation();
  const [cookies, setCookie] = useCookies(['ue']);

  const { user, userEmail, setUserEmail } = useMyContext();
  const [showUserEmailModal, setShowUserEmailModal] = useState(false);

  const [state, InputHandler] = useForm(
    {
      EMAIL: {
        value: '',
        isValid: false,
      },
      CONFIRM_EMAIL: {
        value: '',
        isValid: false,
      },
    },
    false
    // the last false defines if the whole form is valid or not ( since we have set all isvalid to false so our total form validity will also be false)
  );
  const checkForLogin = (el) => {
    if (!user.loggedIn && !userEmail && !cookies?.ue) {
      // we will need UsemEmail to send the bill so we will open modal
      return setShowUserEmailModal(true);
    } else if (!user.loggedIn && (userEmail || cookies?.ue)) {
      // user wnats to buy from email
      return buyButtonAction(el);
    } else if (user.loggedIn) {
      // buy as a loggedIn user
      return buyButtonAction(el);
    }
  };

  const userEmailHandler = (el) => {
    console.log(state);
    setUserEmail(state.inputs.EMAIL.value);
    setCookie('ue', state.inputs.EMAIL.value, {
      path: '/',
    });
    // wee also need to set email in token later
    setShowUserEmailModal(false);
    checkForLogin(el);
  };
  const handleCloseDialog = () => {};

  return (
    <>
      <div className={classes.packageComponent} key={pkg.id}>
        <div className={classes.packageTitle}>{pkg.name}</div>
        <div className={classes.packagePrice}>
          {pkg.price} {convertCurrency(pkg.currency)}
        </div>
        <div
          className={classes.packageDescription}
          dangerouslySetInnerHTML={{ __html: pkg.description }}
        />
        <div className={classes.packageBuyButtonContainer}>
          {userPackages.findIndex(
            (userPkg) =>
              userPkg.sku === pkg.sku &&
              userPkg.validFrom < Date.now() &&
              userPkg.validTo > Date.now()
          ) !== -1 ? (
            <div id={pkg.id} name={pkg.id}>
              <Button className={classes.packageBoughtButtonText}>
                {t('packages.Bought')}
              </Button>
            </div>
          ) : (
            <div id={pkg.id} name={pkg.id} onClick={() => checkForLogin(pkg)}>
              <Button className={classes.packageBuyButtonText}>
                {t('packages.Order')}
              </Button>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={showUserEmailModal}
        contentLabel='Select Date'
        className={'modal'}
        overlayClassName={'overlay'}
        onRequestClose={handleCloseDialog}
      >
        <div className={` copy-popup `}>
          <div className={classes.popupEmailForm}>
            <Input
              id='EMAIL'
              label='EMAIL'
              placeholder={'ENTER YOUR EMAIL'}
              type='text'
              element='input'
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
              errorText={'please enter valid email'}
              onInput={InputHandler}
              iconName='envelope'
            />
            <Input
              id='CONFIRM_EMAIL'
              label='CONFIRM_EMAIL'
              placeholder={'ENTER YOUR  EMAIL AGAIN'}
              type='text'
              element='input'
              validators={[
                VALIDATOR_PASSWORDMATCH(
                  state.inputs.EMAIL.value,
                  state.inputs.CONFIRM_EMAIL.value
                ),
              ]}
              errorText={'Emails dont match'}
              onInput={InputHandler}
              iconName='envelope'
            />
          </div>
          <div className={`${classes.emailConfirmModalButton} font-400 `}>
            <Button
              onClick={() => userEmailHandler(pkg)}
              disabled={!state.isValid}
            >
              Confirm
            </Button>
            <Button onClick={() => setShowUserEmailModal(false)} inverse>
              {' '}
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PackageComponent;
