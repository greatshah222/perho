import React from 'react';
import { getImageByKey } from '../../scripts/getImageByKey';
import * as classes from './HeroBanner.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Banner(props) {
  return (
    <div className={classes.container_singleItem} onClick={props.onClick}>
      <div className={classes.container_singleItemPrimary}>
        {props.imageNameWeb ? (
          // <img
          //   src={props.imageNameWeb}
          //   alt={props.imageName}
          //   className={classes.container_singleItem_image}
          // />
          <div
            style={{ backgroundImage: `url(${props.imageNameWeb})` }}
            className={classes.container_singleItem_image}
          ></div>
        ) : (
          <div
            style={{
              backgroundImage: `url(${getImageByKey(
                props.image ? props.image : 'bannerdemo'
              )})`,
            }}
            className={classes.container_singleItem_image}
          ></div>
          // <img
          //   src={getImageByKey(props.image ? props.image : 'bannerdemo')}
          //   alt='banner'
          //   className={classes.container_singleItem_image}
          // />
        )}
      </div>
      {!props.HeroPrimaryDetailsHide && (
        <>
          {/* // <div className={classes.overlayContainer}> */}
          <div className={classes.wrapper_center}>
            <img
              src={getImageByKey('playButtonPoster')}
              alt=''
              className={classes.posterImage}
            />
            <h3>
              {' '}
              {props.bannerHeading ? props.bannerHeading : 'Icareus Test Text'}
            </h3>
            <button>watch now</button>
          </div>
          {!props.hideActions && (
            <div className={classes.wrapper_bottom}>
              <p className={classes.wrapper_bottom_likes}>
                <FontAwesomeIcon icon='thumbs-up' />
                1.750k
              </p>
              <p className={classes.wrapper_bottom_duration}>4:19</p>
            </div>
          )}
        </>
      )}

      {props.bannerTitle && (
        <div className={classes.bannerTitle}>
          <h3 className={classes.bannerTitle_title}>{props.bannerTitle}</h3>
        </div>
      )}
    </div>
  );
}
