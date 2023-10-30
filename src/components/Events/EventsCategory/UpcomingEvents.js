import React, { useEffect, useState } from 'react';
import EventsItem from '../Events/EventsItem';

import { getUpcomingEvents } from '../../../scripts/dataHandlers';
import { useTranslation } from 'react-i18next';

export default function UpcomingEvents(props) {
  const [allUpcomingEvents, setAllUpcomingEvents] = useState(null);
  const { t } = useTranslation();

  const { limit } = props.settings;

  useEffect(() => {
    const runFunction = async () => {
      try {
        const res1 = await getUpcomingEvents(props.organizationId, limit);

        if (res1.data.status === 'ok') {
          setAllUpcomingEvents(res1.data.events);
        }
      } catch (error) {
        console.log(error);
      }
    };

    props.organizationId && runFunction();
  }, [props.organizationId, limit]);
  return (
    // If it includes props(upcomingEventCategory) , it means it wont have any category id or name and we have to fetch filter data and route accordingly
    allUpcomingEvents &&
    allUpcomingEvents.length > 0 && (
      <EventsItem
        allEvents={allUpcomingEvents}
        heading={t('eventsCategory.upcomingEventsTitle')}
        upcomingEventCategory={true}
        organizationId={props.organizationId}
        homepageContainer={props.homepageContainer}
        extraClassname={props.extraClassname}
        styles={props.styles}
      />
    )
  );
}
