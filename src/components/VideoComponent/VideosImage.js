import React from 'react';
import { getImageByKey } from '../../scripts/getImageByKey';
import * as classes from '../ViewedSection/ViewedSection.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { convertDuration } from '../../scripts/utils';

export default function VideosImage(props) {
  return (
    <div
      className={`${classes.ViewedSectionSecondary__3videos__image} image_wrapper`}
      onClick={props.onClick}
    >
      {props.imageNameWeb && (
        <img src={props.imageNameWeb} alt={props.imageName} />
      )}
      {props.imageName && (
        <img src={getImageByKey(props.imageName)} alt={props.imageName} />
      )}

      {/* to define the position of play button */}
      {props.showPlayIcon && (
        <div
          className={classes.ViewedSectionSecondary__3videos__videoicon_overlay}
          style={{
            top: props.top ? props.top : '50%',
            left: props.left ? props.left : '50%',
          }}
        >
          <FontAwesomeIcon icon='play' size={props.playIconSize} />
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
