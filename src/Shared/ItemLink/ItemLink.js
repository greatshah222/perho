import React from 'react';
import * as classes from './ItemLink.module.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ItemLink({
  extraClassname,
  link,
  route,
  clickCategory,
  id,
  title,
}) {
  const { t } = useTranslation();

  return link ? (
    <div
      className={`${classes.ItemLink} ${
        extraClassname ? 'font-200' : 'font-200'
      }`}
    >
      <Link to={route}>{t('categoryTitle.viewAllButton')}</Link>
    </div>
  ) : (
    <div
      className={`${classes.ItemLink} ${
        extraClassname ? 'font-200' : 'font-200'
      }`}
      onClick={() => clickCategory({ id: id, title: title })}
    >
      {t('categoryTitle.viewAllButton')}
    </div>
  );
}
