import React from 'react';
import * as classes from '../../EditorChoice/EditorChoice.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EventsCategoryItems from '../EventsCategory/EventsCategoryItems';

export default function EventsEditorChoice({
  organizationId,
  categoryId,
  limit,
}) {
  return (
    <div className={classes.EditorChoice} style={{ margin: '30px 0' }}>
      <div className={classes.EditorChoicePrimary} style={{ width: '100%' }}>
        <div className={classes.starIcon}>
          <FontAwesomeIcon icon='star' size='2x' />
          <FontAwesomeIcon icon='star' size='3x' />
          <FontAwesomeIcon icon='star' size='2x' />
        </div>
        <h2>Editor's Choice</h2>
        <EventsCategoryItems
          organizationId={organizationId}
          categoryId={categoryId}
          limit={limit}
        />
      </div>
    </div>
  );
}
