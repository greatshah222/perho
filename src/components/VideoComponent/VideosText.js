import React from 'react';
import * as classes from '../ViewedSection/ViewedSection.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function VideosText(props) {
  let lengthofText = props.text.length;
  return (
    <div
      className={classes.ViewedSectionSecondary__3videos__text}
      onClick={props.onClick && props.onClick}
    >
      <div
        className={classes.ViewedSectionSecondary__3videos__text_description}
        style={props.style}
      >
        {lengthofText > 22
          ? `${props.text.replace(/^(.{22}[^\s]*).*/, '$1')} ...`
          : props.text}
      </div>
      {!props.hideActions && (
        <div className={classes.ViewedSectionSecondary__3videos__text_actions}>
          <p>
            {' '}
            <FontAwesomeIcon icon='eye' /> {props.views}k Views
          </p>
          <p>
            <FontAwesomeIcon icon='comment' /> {props.comments}
          </p>
        </div>
      )}
    </div>
  );
}
