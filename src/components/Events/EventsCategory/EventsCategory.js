import React, { useEffect, useState } from 'react';
import EventCategoryItems from './EventsCategoryItems';
import { getEventsCategories } from '../../../scripts/dataHandlers';

export default function EventsCategory(props) {
  const [allEventsCategory, setAllEventsCategory] = useState(null);
  console.log(props);
  useEffect(() => {
    const getData = async () => {
      const res = await getEventsCategories(props.organizationId);
      console.log(res);
      setAllEventsCategory(res.data.categories);
    };
    if (props.organizationId) {
      getData();
    }
  }, [props.organizationId]);

  return (
    allEventsCategory &&
    allEventsCategory.map((el, i) => (
      <>
        <EventCategoryItems
          key={el.categoryId + i}
          organizationId={props.organizationId}
          categoryId={el.categoryId}
          heading={el.name}
          limit={props.limit}
          extraClassname={props.extraClassname}
        />
      </>
    ))
  );
}
