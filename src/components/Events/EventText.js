import React from 'react';

import * as classes from './Events.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function EventText(props) {
  // {`${props.description.replace(/^(.{1}[^\s]*).*/, '$1')}
  //     ...`}
  const truncate = (str, max, suffix) =>
    [...str].length < max
      ? str
      : `${str.substr(
          0,
          str.substr(0, max - suffix.length).lastIndexOf(' ')
        )}${suffix}`;

  return (
    <div className={classes.Event}>
      <div
        className={`${classes.EventTitle} font-500 itemTitleHeading `}
        onClick={props.onClick}
      >
        <div>{props.title && truncate(props.title, 100, '...')}</div>{' '}
      </div>

      <div
        className={`${classes.EventDuration} font-300  itemTitleHeadingColor`}
      >
        {' '}
        <div className={classes.icon}>
          <FontAwesomeIcon icon='clock' size='1x' />
        </div>
        <div> {props.duration}</div>
      </div>
      <div className={`${classes.EventInfo} font-300`}>
        <div className={`${classes.icon}  `}>
          <FontAwesomeIcon icon='hourglass-start' size='1x' />
        </div>

        <div>{props.info}</div>
      </div>
    </div>
  );
}
