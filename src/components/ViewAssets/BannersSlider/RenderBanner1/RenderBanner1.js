import React from 'react';
import { getImageByKey } from '../../../../scripts/getImageByKey';
import * as classes from './RenderBanner.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { convertDuration } from '../../../../scripts/utils';

export default function RenderBanner1(props) {
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
      className={classes.container_singleItem}
      onClick={() => props.clickItem(props.item)}
    >
      <div className={classes.container_singleItemPrimary}>
        {props.item.bannerImageSmall ? (
          <div
            style={{
              backgroundImage: `url(${props.item.bannerImageSmall})`,
              borderRadius: !props.deviceType ? '32px' : '0px',
            }}
            className={classes.container_singleItem_image}
          ></div>
        ) : (
          <div
            style={{
              backgroundImage: `url(${getImageByKey(
                props.image ? props.image : 'bannerdemo'
              )})`,
              borderRadius: !props.deviceType ? '32px' : '0px',
            }}
            className={classes.container_singleItem_image}
          ></div>
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
                {props.item.name ? props.item.name : 'Icareus Test Text'}
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
                className={`${classes.wrapper_center_info_duration} font-500`}
              >
                <p>
                  {' '}
                  {convertDuration(props.item.duration)}{' '}
                  {(contentRating || releaseYear) && '•'}{' '}
                </p>
                {contentRating && <p>{`${contentRating} +`}</p>}
                <p>{releaseYear && '•'}</p>
                {releaseYear && <p> {releaseYear}</p>}
              </div>
            </div>
            <button>play</button>
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
          <h3 className={classes.bannerTitle_title}>{props.bannerTitle}</h3>
        </div>
      )}
    </div>
  );
}
