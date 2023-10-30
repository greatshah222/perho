import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import Modal from 'react-modal';
import moment from 'moment';

import {
  getAllEvents,
  getLiveNowEvents,
  getUpcomingEvents,
} from '../../../scripts/dataHandlers';
import EventsItem from '../Events/EventsItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as classes from '../Events.module.css';
import { ToastContainer, toast } from 'react-toastify';
import Header from '../../../Shared/Header/Header';
import { useTranslation } from 'react-i18next';

import ReactDatePicker from '../../../Shared/DateRange/ReactDatePicker';

Modal.setAppElement(document.body);

export default function EventsCategoryItem({ settings: { limit, eventType } }) {
  const { t } = useTranslation();

  let { categoryName, organizationId, categoryId } = useParams();
  console.log(categoryName, organizationId, categoryId);
  const [allEvents, setAllEvents] = useState(null);
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [endDateValue, setEndDateValue] = useState(new Date());
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [upcomingFilterApplied, setupcomingFilterApplied] = useState(true);

  // time ranges from filters
  const [ranges, setRanges] = useState(null);

  const fetchOnlyUpcomingEvents = useCallback(async () => {
    // there are 3 types of eventType="all" "past" "future"
    // default is "all"
    let from, to;
    if (eventType === 'all') {
      from = null;
    } else if (eventType === 'future') {
      // show only future Events
      from = Date.now();
    } else if (eventType === 'past') {
      from = null;
      to = Date.now();
    }
    let res;
    if (categoryId === 'upcomingEvent') {
      // it means theere is no category but contains events from "upcomingEvents or live events", we have to send different api requests
      res = await getUpcomingEvents(organizationId, limit);
    } else if (categoryId === 'liveEvent') {
      res = await getLiveNowEvents(organizationId);
    } else {
      res = await getAllEvents(organizationId, categoryId, limit, from, to);
    }
    console.log(res);
    setAllEvents(res.data.events);
  }, [categoryId, organizationId, limit, eventType]);

  useEffect(() => {
    organizationId && categoryId && fetchOnlyUpcomingEvents();
  }, [organizationId, categoryId, fetchOnlyUpcomingEvents]);

  const removeAppliedFilter = () => {
    setupcomingFilterApplied(true);
    setRanges(null);
    fetchOnlyUpcomingEvents();
  };
  const selectionRange = {
    startDate: startDateValue,
    endDate: endDateValue,
    key: 'selection',
  };
  const handleSelect = (ranges) => {
    setStartDateValue(ranges.selection.startDate);
    setEndDateValue(ranges.selection.endDate);
    setRanges(ranges);
  };
  const handleCloseDialog = () => {
    console.log(showDateTimeModal);
    setShowDateTimeModal(!showDateTimeModal);
  };

  const handleConfirm = async () => {
    if (startDateValue.getTime() === endDateValue.getTime()) {
      return toast.error(`${t('eventsCategory.errorStartEndSame')}`, {
        autoClose: 10000,
        position: 'top-center',
        theme: 'dark',
      });
    }

    let res;
    if (categoryId === 'upcomingEvent') {
      // it means theere is no category but contains events from "upcomingEvents", we have to send different api requests
      res = await getUpcomingEvents(
        organizationId,
        10,
        Date.parse(startDateValue),
        Date.parse(endDateValue)
      );
    } else if (categoryId === 'liveEvent') {
      res = await getLiveNowEvents(organizationId);
    } else {
      res = await getAllEvents(
        organizationId,
        categoryId,
        null,
        Date.parse(startDateValue),
        Date.parse(endDateValue)
      );
    }

    console.log(res);
    if (res.data.status === 'ok') {
      setAllEvents(res.data.events);
    }
    setStartDateValue(new Date());
    setEndDateValue(new Date());

    handleCloseDialog();
    setupcomingFilterApplied(false);
  };

  return (
    <>
      <div className={classes.Events_main} style={{ margin: '0 auto' }}>
        <div className={classes.Events_main_info}>
          <Header
            extraClassname={true}
            title={
              categoryId === 'upcomingEvent' || categoryId === 'liveEvent'
                ? categoryId === 'upcomingEvent'
                  ? t('eventsCategory.upcomingEventsTitle')
                  : t('eventsCategory.liveNowEventsTitle')
                : categoryName
            }
            showTitle={true}
          />

          <div className={`${classes.Events_main_info_button} font-400`}>
            {!upcomingFilterApplied && categoryId !== 'liveEvent' && ranges && (
              <div style={{ color: '#161eaf' }}>
                {moment(ranges.selection.startDate).format('L')} -
                {moment(ranges.selection.endDate).format(' L')}
                {console.log(ranges)}
              </div>
            )}
            {!upcomingFilterApplied && (
              <button
                className={classes.Events_main_info_filter_removeFilter}
                onClick={removeAppliedFilter}
              >
                <FontAwesomeIcon
                  icon='times'
                  size='1x'
                  className={classes.removeIcon}
                />
              </button>
            )}
            <button
              className={classes.Events_main_info_filter_addFilter}
              onClick={handleCloseDialog}
            >
              <FontAwesomeIcon
                icon='calendar'
                size='1x'
                className={classes.filterIcon}
              />
            </button>
          </div>
        </div>
      </div>
      {console.log(categoryId, upcomingFilterApplied)}
      <Modal
        isOpen={showDateTimeModal}
        contentLabel='Select Date'
        className={'modal'}
        overlayClassName={'overlay'}
        onRequestClose={handleCloseDialog}
      >
        <ToastContainer />

        <div className={classes.modalItem}>
          {' '}
          <ReactDatePicker
            selectionRange={selectionRange}
            handleSelect={handleSelect}
          />
          <div className={classes.modalItem_button}>
            <button
              className={classes.modalItem_button_confirm}
              onClick={handleConfirm}
            >
              {t('eventsCategory.confirm')}
            </button>
            <button
              onClick={handleCloseDialog}
              className={classes.modalItem_button_cancel}
            >
              {t('eventsCategory.cancel')}
            </button>
          </div>
        </div>
      </Modal>

      <EventsItem
        allEvents={allEvents}
        heading={categoryName}
        organizationId={organizationId}
        categoryId={categoryId}
        // need to set prooperty to true so we can add calendar icon herej
        hideViewAll={true}
      />
    </>
  );
}
