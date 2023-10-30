import React from 'react';

import EventsCategory from '../EventsCategory/EventsCategory';
import UpcomingEvents from '../EventsCategory/UpcomingEvents';
import EventsEditorChoice from '../EventsEditorChoice/EventsEditorChoice';

export default function Events(props) {
  let { organizationId } = props;
  console.log(props);

  return (
    <>
      <UpcomingEvents organizationId={organizationId} limit={3} />
      {/* we have to set the limit via some config file. In the events page we will only show 3 events per category */}
      {!props.hideEditorChoiceEvent && (
        <EventsEditorChoice
          organizationId='124292109'
          limit={4}
          categoryId='126941514'
        />
      )}
      <EventsCategory organizationId={organizationId} limit={3} />
    </>
  );
}
