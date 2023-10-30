import React, { useEffect, useState } from 'react';
import * as classes from './ItemTitle1.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { convertDuration } from '../../../../scripts/utils';
import { useTranslation } from 'react-i18next';
//import DetailsFolderNames from '../../../Details/DetailsFolderNames';

export default function ItemTitle1(props) {
  const [text, setText] = useState(null);
  const [lengthOfText, setLengthOfText] = useState(null);

  const { t } = useTranslation();
  //console.log(props);

  /*
  useEffect(() => {
    if (props.item) {
      let textVal = props.item.isSerie
        ? props.item.serie?.title || props.item.title
        : props.item.name;

      if (!textVal) {
        textVal = props.item.title;
      } 
      setText(textVal);
      setLengthOfText(textVal?.length);
    }
  }, [props.item]);
  */

  useEffect(() => {
    if (props.item) {
      let textVal =
        props.item.name || props.item.title || props.item.serie?.title;

      setText(textVal);
      setLengthOfText(textVal?.length);
    }
  }, [props.item]);

  //console.log(props.item.releaseYear === 0, props.item.releaseYear);
  return (
    text && (
      <div
        className={classes.ViewedSectionSecondary__3videos__text}
        onClick={props.onClick && props.onClick}
      >
        <div
          className={classes.ViewedSectionSecondary__3videos__text_description}
          style={props.style}
        >
          <div
            className={`${classes.ViewedSectionSecondary__3videos__text_description_heading}   font-500 itemTitleHeadingColor`}
            style={props.textStyle}
          >
            {props.cutText && lengthOfText > 22
              ? `${text.replace(/^(.{22}[^\s]*).*/, '$1')} ...`
              : text}
          </div>

          <div
            className={`${classes.ViewedSectionSecondary__3videos__text_description_duration} font-100`}
          >
            {props.showCategoryName && props.item.folders && (
              <div style={props.textStyle}>
                {/* We are taking only max 3 category name */}
                {props.item.folders
                  .slice(0, 3)
                  .map((el) => el.name)
                  .join(' , ')}
              </div>
            )}
            {/* {props.showDuration &&
              props.showCategoryName &&
              props.item.folders &&
              props.item.folders.length > 0 && (
                <div className={classes.divider}>{'•'}</div>
              )} */}
            {props.showDuration && (
              <div>{convertDuration(props.item.duration)}</div>
            )}
            {props.showReleaseYear &&
              props.showDuration &&
              props.item.releaseYear !== 0 && (
                <div className={classes.divider}>{'•'}</div>
              )}

            {props.showReleaseYear && (
              <div>
                {props.item.releaseYear && props.item.releaseYear !== 0
                  ? props.item.releaseYear
                  : null}
              </div>
            )}
          </div>

          {props.showStatus && (
            <div
              className={`${classes.ViewedSectionSecondary__3videos__text_description_status} font-000`}
            >
              {t('itemTitle.available')}
            </div>
          )}

          {props.showActions && (
            <div
              className={classes.ViewedSectionSecondary__3videos__text_actions}
            >
              <p>
                {' '}
                <FontAwesomeIcon icon='eye' /> {props.views}k{' '}
                {t('itemTitle.views')}
              </p>
              <p>
                <FontAwesomeIcon icon='comment' /> {props.comments}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  );
}
