import React from 'react';
import * as classes from './Header.module.css';

export default function Header({ showTitle, extraClassname, title }) {
  console.log(showTitle, extraClassname, title);

  return (
    <div
      className={`${classes.HeaderTitle} ${
        extraClassname ? 'font-700' : 'font-500'
      }`}
    >
      {showTitle !== false ? title : null}
    </div>
  );
}
