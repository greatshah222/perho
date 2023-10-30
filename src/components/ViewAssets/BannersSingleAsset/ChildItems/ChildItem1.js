import React from 'react';
//import { getImageByKey } from '../../../../scripts/getImageByKey';
import * as classes from './ChildItem1.module.css';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RenderFolderNames from '../../../Details/DetailsFolderNames';
//import RenderItemDescription from '../../../Details/DetailsItemDescription';

export default function ChildItem1(props) {
  console.log(props);
  return (
    <div className={classes.itemContainer} onClick={props.onClick}>
      <img
        src={props.item.bannerImageSmall}
        alt=''
        className={classes.itemImage}
      />
      <div className={classes.itemDetailsContainer}>
        <div className={classes.itemTitle}>
          {props.item.name}
        </div>

        <div className={classes.itemCategories}>
          <RenderFolderNames
            item={props.item}
          />
        </div>

        <div className={classes.itemDescription} dangerouslySetInnerHTML={{ __html: props.item.description }} />
     
      </div>

    </div>
  );
}

/*
<div className={classes.container_singleItem} onClick={props.onClick}>
      <div className={classes.container_singleItemPrimary}>
        {props.item.bannerImageSmall ? (
          <img
            src={props.item.bannerImageSmall}
            alt=''
            className={classes.container_singleItem_image}
          />
        ) : (
          <div
            style={{
              backgroundImage: `url(${getImageByKey(
                props.image ? props.image : 'bannerdemo'
              )})`,
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
              <div className={classes.wrapper_center_info_title}>
                {' '}
                {props.item.name ? props.item.name : 'Icareus Test Text'}
              </div>
              <div className={classes.wrapper_center_info_category}>
                Animation , Family, Adventure,Fantasy
              </div>
              <div className={classes.wrapper_center_info_duration}>
                1h 43m 12+ 2020
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

*/