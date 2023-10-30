import React from 'react';
import * as classes from './ItemImage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { convertDuration } from '../../../../scripts/utils';
import { getImageByKey } from '../../../../scripts/getImageByKey';

export default function ItemImage1(props) {
  //console.log(props.item.title);
  const pickImage = (item) => {
    if (props.imageType === 'thumbnail') {
      return item.thumbnailSmall || getImageByKey('comingSoonThumbnail');
    } else if (props.imageType === 'thumbnailSerie') {
      return item.thumbnailSmall || getImageByKey('comingSoonThumbnailSerie');
    } else if (item.serie) {
      return item.serie.coverImageSmall;
    } else {
      return item.coverImageSmall ? item.coverImageSmall : item.thumbnailSmall;
    }
  };

  let imageClassName = classes.ViewedSectionSecondary__3videos__image;
  if (props.maintainImageAspectRatio) {
    imageClassName = `${classes.ViewedSectionSecondary__3videos__image} image_wrapper`;
  }
  return (
    <div
      className={imageClassName}
      onClick={props.onClick}
      style={{ position: 'relative !important' }}
    >
      {props.item && (
        <img
          src={
            pickImage(props.item)
              ? pickImage(props.item)
              : getImageByKey('comingSoon')
          }
          alt=''
        />
      )}
      {props.showEditorChoiceIcon && (
        <div className={classes.editorChoice}>
          <img src={getImageByKey('editorChoiceIcon')} alt='Editor Choice' />
        </div>
      )}

      {/* to define the position of play button */}
      {props.showPlayIcon && (
        <div
          className={`${classes.ViewedSectionSecondary__3videos__image_Overlay} ${classes.ViewedSectionSecondary__3videos__image_Overlay_blur} overlay_blur`}
        >
          <div
            className={`${classes.ViewedSectionSecondary__3videos__videoicon_overlay} playicon_overlay`}
            style={{
              top: props.top ? props.top : '50%',
              left: props.left ? props.left : '50%',
            }}
          >
            {!props.hidePlayButton && (
              <FontAwesomeIcon icon='play' size={props.playIconSize} />
            )}
            {props.hidePlayButton && (
              <div
                className={`${classes.ViewedSectionSecondary__3videos__videoicon_overlay} playicon_overlay`}
                style={{
                  top: props.top ? props.top : '50%',
                  left: props.left ? props.left : '50%',
                  color: 'white',
                }}
              >
                <div>{props.item.title || props.item.name}</div>
                {!props.hideShowAllButton && (
                  <button
                    className={`${classes.ViewedSectionSecondary__3videos__videoicon_overlay_view_all}`}
                  >
                    Play
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {props.showLikeIcon && (
        <div className={classes.ViewedSectionSecondary__3videos__image_overlay}>
          <div className={classes.wrapper_bottom}>
            {props.likes && (
              <p className={classes.wrapper_bottom_likes}>
                <FontAwesomeIcon icon='thumbs-up' />
                {props.likes}k
              </p>
            )}
            <p className={classes.wrapper_bottom_duration}>
              {convertDuration(props.duration)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
