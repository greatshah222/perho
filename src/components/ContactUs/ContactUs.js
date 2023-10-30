import React from 'react';
import { getImageByKey } from '../../scripts/getImageByKey';
import * as classes from './ContactUs.module.css';
import { useTranslation } from 'react-i18next';

export default function ContactUs() {

  // Setup translate function
  const { t } = useTranslation();

  return (
    <div className={classes.ContactUs}>
      <div className={classes.ContactUsPrimary}>
        <div className={classes.ContactUs_image}>
          <img src={getImageByKey('contactus')} alt='Digital Tree' />
        </div>
        <div className={classes.ContactUs_description}>
          <div className={classes.ContactUs_description_Primary}>
            <h4 className='font-700'>{t('contactUs.contactUs')}</h4>
            <div className={classes.ContactUs_description_address}>
              <div
                className={`${classes.ContactUs_description_address_info} font-400`}
              >
                <div
                  className={classes.ContactUs_description_address_info_title}
                >
                  {' '}
                  {t('contactUs.address')}
                </div>
                <div>8 Michael Karaoli,</div>
                <div>Anemomylos Building, 3rd floor,</div>
                <div> Nicosia 1095</div>
              </div>
            </div>
            <div className={classes.ContactUs_description_phone}>
              <div className={classes.ContactUs_description_address_info_title}>
                {' '}
                {t('contactUs.phone')}
              </div>
              <div>(+357) 22 396 999</div>
            </div>
            <div className={classes.ContactUs_description_email}>
              <a
                className={classes.ContactUs_description_email_button}
                href='mailto:info@digitaltree.com.cy
'
              >
                {t('contactUs.sendEmail')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
