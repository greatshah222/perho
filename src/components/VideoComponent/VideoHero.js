import React from 'react';

import { getImageByKey } from '../../scripts/getImageByKey';
import * as classes from '../Hero/HeroBanner.module.css';

export default function VideoHero(props) {
  let lengthofText = props.title.length;

  return (
    <div
      className={`${classes.container_multipleItemprimary} ${classes.container_multipleItemprimary_background}`}
      onClick={props.onClick}
    >
      <div className={`${classes.container_multipleItem__image} image_wrapper`}>
        {props.imageNameWeb ? (
          <img src={props.imageNameWeb} alt={'Icareus'} />
        ) : (
          <img
            src={getImageByKey(
              props.imageName ? props.imageName : 'bannerdemo_image1'
            )}
            alt={props.imageName}
          />
        )}
      </div>
      {props.showEditorChoiceIcon && (
        <div className={classes.editorChoice}>
          <img src={getImageByKey('editorChoiceIcon')} alt='Editor Choice' />
        </div>
      )}
      {(props.categoryName || props.title) && (
        <div className={classes.container_multipleItem__text}>
          <p className={`${classes.post_title} font-600`}>
            {lengthofText > 22
              ? `${props.title.replace(/^(.{22}[^\s]*).*/, '$1')} ...`
              : props.title}
          </p>
          {props.categoryName && (
            <h3 className={`${classes.post_cateogory} font-400`}>
              {props.categoryName}
            </h3>
          )}
        </div>
      )}
    </div>
  );
}
