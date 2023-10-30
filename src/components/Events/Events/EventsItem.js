import React from 'react';
import * as classes from '../Events.module.css';
import * as classesVideo from './EventsItem.module.css';
import VideosImage from '../../VideoComponent/VideosImage';
import EventText from '../EventText';
import { convertDuration, momentDate } from '../../../scripts/utils';
import { getImageByKey } from '../../../scripts/getImageByKey';
import Loader from 'react-loader-spinner';
import { useHistory } from 'react-router-dom';
import { useMyContext } from '../../../contexts/StateHolder';
import Header from '../../../Shared/Header/Header';
import ItemLink from '../../../Shared/ItemLink/ItemLink';
import { useTranslation } from 'react-i18next';
import 'moment/locale/fi';
export default function EventsItem({
  allEvents,
  organizationId,
  categoryId,
  secondaryClassName,
  homepageContainer,
  hideViewAll,
  upcomingEventCategory,
  extraClassname,
  heading,
}) {
  const { setSingleEventItem } = useMyContext();
  const { t } = useTranslation();

  const history = useHistory();
  let SecondaryClassName = secondaryClassName
    ? 'ViewedSectionSecondary__2videos'
    : 'ViewedSectionSecondary__3videos';
  let container = secondaryClassName
    ? 'container_2videos'
    : 'container_3videos';

  if (homepageContainer) {
    container = `${container} container_homePage`;
  }
  let imageName;
  const clickhandler = (el) => {
    setSingleEventItem(el);

    history.push(`/event/${organizationId}/${el.eventId}`);
  };
  //   as a general note(from ossi), if the event has a 'publicName', 'durationPublic', 'startTimePublic' those are what should be displayed to end users (but events are not required to have these public fields so not all events have them. If the event doesnot have 'publicName', 'durationPublic', 'startTimePublic'  use 'name' 'duration' 'startTime)
  return allEvents ? (
    <>
      <div className={classes[container]}>
        {heading && !hideViewAll && (
          <div className={classes.Events_main}>
            <div className={classes.Events_main_info}>
              <Header
                extraClassname={extraClassname}
                title={heading}
                showTitle={true}
              />

              {allEvents.length > 0 && upcomingEventCategory ? (
                <>
                  <ItemLink
                    link={true}
                    route={
                      heading === t('eventsCategory.upcomingEventsTitle')
                        ? `/events/Upcoming Events/${organizationId}/upcomingEvent`
                        : `/events/Live Now Events/${organizationId}/liveEvent`
                    }
                  />
                </>
              ) : (
                <ItemLink
                  route={`/events/${heading}/${organizationId}/${categoryId}`}
                  link={true}
                />
              )}
            </div>
          </div>
        )}
        {allEvents.length > 0 ? (
          <div className={classes[SecondaryClassName]}>
            {allEvents.map((el, i) => {
              imageName = el.thumbnailImage ? null : 'icareus_event_default';

              return (
                <div
                  className={`${classesVideo.ViewedSectionSecondary__2videos__main} ${classes.Events}`}
                  key={i}
                >
                  <div className={classesVideo.Events_Image}>
                    <VideosImage
                      imageNameWeb={imageName ? null : el.thumbnailImage}
                      imageName={imageName ? imageName : null}
                      showPlayIcon={true}
                      showLikeIcon={false}
                      likes='2.75'
                      duration='4:19'
                      top='50%'
                      left='50%'
                      onClick={() => clickhandler(el)}
                      playIconSize='2x'
                    />
                  </div>
                  {/* // description is based on language so we get the language value first. Description includes html tags so regular expression removes it  */}
                  <EventText
                    title={
                      el.publicName[el.defaultLanguage]
                        ? el.publicName[el.defaultLanguage]
                        : el.name[el.defaultLanguage] &&
                          el.name.en_US.replace(/<[^>]*>?/gm, '')
                    }
                    onClick={() => clickhandler(el)}
                    // H, HH       24 hour time
                    // h, or hh    12 hour time (use in conjunction with a or A)
                    info={
                      el.startTimePublic
                        ? momentDate(el.startTimePublic)
                        : momentDate(el.startTime)
                    }
                    duration={
                      el.durationPublic
                        ? convertDuration(el.durationPublic)
                        : convertDuration(el.duration)
                    }
                  />{' '}
                </div>
              );
            })}
          </div>
        ) : (
          <div className={classes.NoDataAvailable}>
            <Header title={t('eventsCategory.noEvents')} />
            <img
              src={getImageByKey('no_data_available')}
              alt='no_data_available'
            />
          </div>
        )}
      </div>
    </>
  ) : (
    <div className='display-flex-center'>
      {' '}
      <Loader type='TailSpin' color='#161eaf' />{' '}
    </div>
  );
}
