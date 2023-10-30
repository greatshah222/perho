import React from 'react';
import { getImageByKey } from '../../../../scripts/getImageByKey';
import * as classes from './RenderBanner.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { convertDuration } from '../../../../scripts/utils';
import { useTranslation } from 'react-i18next';

export default function RenderBanner2(props) {

    // Setup translate function
    const { t } = useTranslation();

  //let imageStyle = !props.deviceType && `borderRadius:'32px`;
  let contentRating =
    props.item.contentRatings[0] &&
    props.item.contentRatings[0].key.split('_')[2] &&
    props.item.contentRatings[0].key.split('_')[2];

  let releaseYear =
    props.item.releaseYear && props.item.releaseYear !== 0
      ? props.item.releaseYear
      : false;
  return (
    <div
      className={`${classes.container_singleItem} `}
      onClick={() => props.clickItem(props.item)}
    >
      <div
        className={`${classes.container_singleItemPrimaryBanner2} overlay_blur `}
      >
        {props.item.bannerImageSmall ? (
          <img
            src={props.item.bannerImageSmall}
            height='100%'
            alt=''
            style={{
              position: 'relative',
              borderRadius: !props.deviceType ? '0px' : '0px',
            }}
          />
        ) : (
          <img
            src={`${getImageByKey(props.image ? props.image : 'bannerdemo')}`}
            alt='Banner'
            style={{
              position: 'relative',
              borderRadius: !props.deviceType ? '32px' : '0px',
            }}
          />
        )}
      </div>
      {
        <>
          <div className={classes.wrapper_center}>
            {props.showPlayButtonImage && (
              <img
                src={getImageByKey('playButtonPoster')}
                alt=''
                className={classes.posterImage}
              />
            )}
            <div className={classes.wrapper_center_info}>
              <div className={'font-800'}>
                {' '}
                {props.showTitle && props.item.name ? props.item.name : ''}
              </div>
              <div
                className={`${classes.wrapper_center_info_category} font-500`}
              >
                {/* We are taking only max 3 category name */}
                {props.item.folders
                  .slice(0, 3)
                  .map((el) => el.name)
                  .join(' , ')}
              </div>

              {/* inncluding both global and css modules */}
              <div
                className={`${classes.wrapper_center_info_ingress} font-200`}
              >
                {props.item.ingress && <p> {props.item.ingress}</p>}
              </div>
              <div
                className={`${classes.wrapper_center_info_duration} font-500`}
              >
                <p>
                  {' '}
                  {props.showDuration ? convertDuration(props.item.duration):null}{' '}
                  {(contentRating || releaseYear) && '•'}{' '}
                </p>
                {contentRating && <p>{`${contentRating} +`}</p>}
                <p>{releaseYear && '•'}</p>
                {releaseYear && <p> {releaseYear}</p>}
              </div>
            </div>
            
            {props.showActionButton ? <button>{t('banner.action')}</button> : null}
          </div>
          {props.showActions && (
            <div className={classes.wrapper_bottom}>
              <p className={classes.wrapper_bottom_likes}>
                <FontAwesomeIcon icon='thumbs-up' />
                1.750k
              </p>
              <p className={classes.wrapper_bottom_duration}>4:19</p>
            </div>
          )}
        </>
      }

      {props.bannerTitle && (
        <div className={classes.bannerTitle}>
          <h3 className={classes.bannerTitle_title}>
            {props.bannerTitle}
            </h3>
        </div>
      )}
    </div>
  );
}
