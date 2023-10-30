import React, { useEffect, useState } from 'react';
import { getAllEvents } from '../../../scripts/dataHandlers';
import EventsItem from '../Events/EventsItem';

export default function EventsCategoryItems({
  organizationId,
  categoryId,
  limit,
  heading,
  extraClassname,
}) {
  const [allEventsBasedOnCategoryId, setAllEventsBasedOnCategoryId] =
    useState(null);
  useEffect(() => {
    const getData = async () => {
      const res = await getAllEvents(organizationId, categoryId, limit);
      setAllEventsBasedOnCategoryId(res.data.events);
    };
    if (organizationId && categoryId) {
      getData();
    }
  }, [organizationId, categoryId, limit]);

  return (
    allEventsBasedOnCategoryId && (
      <EventsItem
        allEvents={allEventsBasedOnCategoryId}
        heading={heading}
        setAllEventsBasedOnCategoryId={setAllEventsBasedOnCategoryId}
        organizationId={organizationId}
        categoryId={categoryId}
        extraClassname={extraClassname}
      />
    )
  );
}
