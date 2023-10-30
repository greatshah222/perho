import React, { useEffect, useState } from 'react';
import EventsItem from '../Events/EventsItem';

import { getLiveNowEvents } from '../../../scripts/dataHandlers';
import { useTranslation } from 'react-i18next';

export default function LiveNowEvents(props) {
  const { t } = useTranslation();

  const [allLiveNowEvents, setAllLiveNowEvents] = useState(null);

  useEffect(() => {
    const runFunction = async () => {
      try {
        const res1 = await getLiveNowEvents(props.organizationId);

        if (res1.data.status === 'ok') {
          setAllLiveNowEvents(res1.data.events);
        }
      } catch (error) {
        console.log(error);
      }
    };

    props.organizationId && runFunction();
  }, [props.organizationId, props.limit]);
  return (
    // If it includes props(upcomingEventCategory) , it means it wont have any category id or name and we have to fetch filter data and route accordingly
    allLiveNowEvents &&
    allLiveNowEvents.length > 0 && (
      <EventsItem
        allEvents={allLiveNowEvents}
        heading={t('eventsCategory.liveNowEventsTitle')}
        upcomingEventCategory={true}
        organizationId={props.organizationId}
        homepageContainer={props.homepageContainer}
        extraClassname={props.extraClassname}
      />
    )
  );
}
