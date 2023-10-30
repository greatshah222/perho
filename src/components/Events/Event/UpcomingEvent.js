import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Countdown, { zeroPad } from 'react-countdown';
import { useMyContext } from '../../../contexts/StateHolder';

import * as classes from './UpcomingEvent.module.css';
import { useParams } from 'react-router-dom';
import {
  checkTicketNumber,
  getSingleEvent,
  purchasePackage,
} from '../../../scripts/dataHandlers';
import { convertDuration, momentDate } from '../../../scripts/utils';
import AssetVideoPlayer from '../../VideoPlayer/AssetVideoPlayer';
import RenderFolderNames from '../../Details/DetailsFolderNames';
import LiveVideoPlayer from '../../VideoPlayer/LiveVideoPlayer';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import queryString from 'query-string';
import { ToastContainer, toast } from 'react-toastify';
import Header from '../../../Shared/Header/Header';
import Button from '../../../Shared/Button/Button';
import { useTranslation } from 'react-i18next';
import 'moment/locale/fi';

export default function UpcomingEvent(props) {
  console.log(props);
  const { t } = useTranslation();

  const history = useHistory();
  const [singleEvent, setSingleEvent] = useState(null);
  const [defaultLanguage, setDefaudefaultLanguage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recordingAssetId, setRecordingAssetId] = useState(null);

  const [isLiveEvents, setIsLiveEvents] = useState(false);
  const { singleEventItem } = useMyContext();
  const { orgId, eventId } = useParams();

  // if the events requires ticket to grant access

  const [ticketAccess, setTicketAccess] = useState(false);
  const [ticketAccessGranted, setTicketAccessGranted] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['tiAcc']);

  // this useEffect will only run when user is redirected from purchase page to here

  useEffect(() => {
    let params = queryString.parse(window.location.search);

    async function purchasePackageData() {
      const purchaseResponse = await purchasePackage(
        cookies?.userData?.userToken,
        params
      );
      let ticket;

      console.log(purchaseResponse);
      if (purchaseResponse.message === 'ticket purchase successful') {
        setTicketAccessGranted(true);
        ticket = purchaseResponse?.data?.tickets[0];
      } else if (
        purchaseResponse.message.includes('Duplicate / refresh call for order ')
        // this occours when user refrsh the page
      ) {
        ticket = purchaseResponse?.tickets[0];
      }
      ticket && setCookie('tiAcc', ticket, { path: '/' });
      setLoading(false);
    }
    params?.RETURN_CODE ? purchasePackageData() : setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (singleEventItem) {
      setSingleEvent(singleEventItem);
      setDefaudefaultLanguage(singleEventItem.defaultLanguage);
      setLoading(false);
      if (singleEventItem?.accessControls?.length > 0) {
        const ticketExists = singleEventItem?.accessControls.find(
          (el) => el.typeName === 'Ticket'
        );
        if (ticketExists) {
          setTicketAccess(true);
        } else {
          setTicketAccessGranted(true);
          setTicketAccess(false);
        }
      } else {
        setTicketAccess(false);
        setTicketAccessGranted(true);
      }
    } else {
      const getData = async () => {
        const res = await getSingleEvent(orgId, eventId);
        setSingleEvent(res?.event);
        setDefaudefaultLanguage(res?.event?.defaultLanguage);
        if (res?.event?.accessControls?.length > 0) {
          const ticketExists = res?.event?.accessControls.find(
            (el) => el.typeName === 'Ticket'
          );
          if (ticketExists) {
            setTicketAccess(true);
          } else {
            setTicketAccessGranted(true);
            setTicketAccess(false);
          }
        } else {
          setTicketAccess(false);
          setTicketAccessGranted(true);
        }

        setLoading(false);
      };
      getData();
    }
  }, [singleEventItem, orgId, eventId]);

  useEffect(() => {
    // we will have ticket in our cookie all the time && loading false means if the ticket was just bought here and redirected heree it means that function will run first
    if (singleEvent && !loading) {
      let params = queryString.parse(window.location.search);
      console.log(params, params.RETURN_CODE, params.RETURN_CODE === 0);
      if (ticketAccess && !ticketAccessGranted && !cookies?.tiAcc) {
        // dont grant access
        setTicketAccessGranted(false);
      } else if (ticketAccess && !ticketAccessGranted && cookies?.tiAcc) {
        // check if there is ticket Number in cookie
        const checkAcessFromCookie = async () => {
          const res = await checkTicketNumber(
            singleEvent?.eventId,
            cookies?.tiAcc
          );
          if (res.data.status === 'ok') {
            setTicketAccessGranted(true);
            setCookie('tiAcc', cookies?.tiAcc, { path: '/' });
          } else {
            setTicketAccessGranted(false);
            removeCookie('tiAcc', { path: '/' });
          }
        };
        checkAcessFromCookie();
      }
      //  else if (
      //   ticketAccess &&
      //   !ticketAccessGranted &&
      //   params.RETURN_CODE === '0'
      // ) {
      //   // 0 meand success
      //   //          Return codes
      //   // In a notify request only return values 0 or 1 are used.
      //   // Return code	Explanation
      //   // 0	Payment completed successfully.
      //   // 1	Payment failed. Customer did not successfully finish the payment.
      //   // 4	Transaction status could not be updated after customer returned from the web page of a bank. Please use the merchant UI to resolve the payment status.
      //   // 10	Maintenance break. The transaction is not created and the user has been notified and transferred back to the cancel address.
      //   setTicketAccessGranted(true);
      // }
    }
  }, [
    ticketAccessGranted,
    ticketAccess,
    cookies?.tiAcc,
    setCookie,
    removeCookie,
    singleEvent,
    loading,
  ]);

  console.log(ticketAccess, ticketAccessGranted, 'ticket');
  const BuyTickets = ({ routes, futureEvents }) => {
    const [ticketNum, setTicketNum] = useState('');
    const buyNewTicket = () => {
      return history.push(`/${routes.packages}/event/${singleEvent.eventId}`);
    };

    const checkTicketHandler = async () => {
      const res = await checkTicketNumber(singleEvent.eventId, ticketNum);
      console.log(res);
      if (res.data.status === 'ok') {
        setTicketAccessGranted(true);
        setCookie('tiAcc', ticketNum, { path: '/' });
      } else if (res.data.status === 'error') {
        setTicketNum('');
        removeCookie('tiAcc', { path: '/' });

        if (futureEvents) {
          return toast.error(`${t('eventsCategory.eventNotStarted')}`, {
            autoClose: 9000,
            position: 'top-right',
            closeOnClick: true,
            draggable: true,

            hideProgressBar: true,

            theme: 'colored',
          });
        }
        return toast.error(`${t('eventsCategory.invalidTicket')}`, {
          autoClose: 9000,
          position: 'top-right',
          closeOnClick: true,
          draggable: true,

          hideProgressBar: true,

          theme: 'colored',
        });
      }
    };

    return (
      <>
        <ToastContainer />

        <div className={classes.buyTicket}>
          <div className={classes.buyTickets_info}>
            <div className={classes.buyTickets_info_input_null}> null</div>

            <Button onClick={buyNewTicket}>
              {t('eventsCategory.buyTickets')}
            </Button>
          </div>

          <div className={classes.buyTickets_info}>
            <div>{t('eventsCategory.enterTicket')}</div>

            <div className={classes.buyTickets_info_input}>
              <input
                type='text'
                value={ticketNum}
                onChange={(e) => setTicketNum(e.target.value)}
                placeholder={`${t('eventsCategory.enterYourTicket')}`}
              />
              <Button onClick={checkTicketHandler} inverse={true}>
                {' '}
                {t('eventsCategory.watch')}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  };
  const EventsRoomDescription = ({ routes, liveEvent }) => {
    // if access is granted we show room info else event info
    const singleItem = ticketAccessGranted ? singleEvent.rooms[0] : singleEvent;
    return (
      <div className={classes.EventTertairy}>
        <div className={classes.EventPrimary}>
          <Header
            extraClassname={true}
            title={
              singleEvent?.publicName[defaultLanguage] ||
              singleEvent?.name[defaultLanguage]
            }
          />
          {ticketAccess && !ticketAccessGranted && (
            <>
              {liveEvent && (
                <div className={`${classes.EventPrimary_countdown} font-600`}>
                  {t('eventsCategory.eventStarted')}
                </div>
              )}
            </>
          )}

          <div className={classes.EventTimeDescription}>
            <div className={`${classes.EventPrimary_date} font-300`}>
              <div>
                <FontAwesomeIcon icon='calendar' />
              </div>
              <div>{momentDate(singleItem?.startTimePublic)}</div>
            </div>
            <div className={`${classes.EventPrimary_time} font-300`}>
              <div>
                {' '}
                <FontAwesomeIcon icon='clock' />
              </div>
              <div>
                {moment(singleItem?.startTimePublic).locale('fi').format('LT')}
              </div>{' '}
            </div>
            <div className={`${classes.EventPrimary_time} font-300`}>
              <div>
                {' '}
                <FontAwesomeIcon icon='hourglass-start' />
              </div>
              <div>{convertDuration(singleItem?.durationPublic)}</div>{' '}
            </div>
          </div>

          <RenderFolderNames item={singleEvent.categories} />

          {ticketAccess && !ticketAccessGranted && (
            <>
              <BuyTickets routes={routes} />
            </>
          )}

          <div
            className={classes.EventPrimary_description}
            dangerouslySetInnerHTML={{
              __html: singleItem?.description[defaultLanguage],
            }}
          ></div>
        </div>
      </div>
    );
  };

  const CompletedEventsWithRecording = ({ routes }) => {
    const [completedRecordingAssetId, setCompletedRecordingAssetId] =
      useState(null);

    useEffect(() => {
      if (ticketAccessGranted) {
        const checkForVideoAccess = async () => {
          const res = await checkTicketNumber(
            singleEvent?.eventId,
            cookies?.tiAcc
          );
          if (res.data.status === 'ok') {
            setTicketAccessGranted(true);
            setCookie('tiAcc', cookies?.tiAcc, { path: '/' });
            setCompletedRecordingAssetId(
              singleEvent.rooms[0].recordings[0]?.assetId
            );
          } else {
            setTicketAccessGranted(false);
            removeCookie('tiAcc', { path: '/' });
          }
        };
        checkForVideoAccess();
      }
    }, [completedRecordingAssetId]);
    console.log(
      'recording',
      ticketAccess,
      ticketAccessGranted,
      completedRecordingAssetId
    );

    return (
      <>
        {/* // this will work when there is access control applied to recording , wee have prevented a loophole by passing completedRecordingAssetId as a parameter */}
        {ticketAccessGranted &&
          ticketAccess &&
          completedRecordingAssetId &&
          cookies?.tiAcc && (
            <div className={classes.SecondaryContainer}>
              <AssetVideoPlayer
                asset={completedRecordingAssetId}
                isEvent={true}
              />
            </div>
          )}
        {/* // will work when no access is applied */}
        {ticketAccessGranted && !ticketAccess && (
          <div className={classes.SecondaryContainer}>
            <AssetVideoPlayer asset={recordingAssetId} isEvent={true} />
          </div>
        )}

        <EventsRoomDescription routes={routes} />
      </>
    );
  };
  const CompletedEventsWithoutRecording = () => {
    return (
      <div className={classes.EventTertairy}>
        <div className={classes.EventPrimary}>
          <Header
            extraClassname={true}
            title={
              singleEvent?.publicName[defaultLanguage] ||
              singleEvent?.name[defaultLanguage]
            }
          />
          {/* <div className={`${classes.EventPrimary_title} font-800`}>
            {singleEvent.publicName[defaultLanguage] ||
              singleEvent.name[defaultLanguage]}
          </div> */}
          <div className={`${classes.EventPrimary_countdown} font-600`}>
            {t('eventsCategory.eventsEnded')}
          </div>
          <div className={classes.EventTimeDescription}>
            <div className={`${classes.EventPrimary_date} font-300`}>
              <div>
                <FontAwesomeIcon icon='calendar' />
              </div>

              <div>{momentDate(singleEvent?.startTimePublic)}</div>
            </div>
            <div className={`${classes.EventPrimary_time} font-300`}>
              <div>
                {' '}
                <FontAwesomeIcon icon='clock' />
              </div>
              <div>
                {moment(singleEvent.startTimePublic).locale('fi').format('LT')}
              </div>{' '}
            </div>
          </div>
          <div
            className={classes.EventPrimary_description}
            dangerouslySetInnerHTML={{
              __html: singleEvent.description[defaultLanguage],
            }}
          ></div>
        </div>
      </div>
    );
  };

  const CompletedEvents = ({ routes }) => {
    useEffect(() => {
      if (singleEvent?.rooms?.length > 0) {
        setRecordingAssetId(singleEvent.rooms[0].recordings[0]?.assetId);
        setIsLiveEvents(false);
      }

      let currentTime = Date.now();
      // time is second, Dat.now is ms so multiply by 1000
      let totalEndTime =
        singleEvent?.startTimePublic + singleEvent?.durationPublic * 1000;

      if (
        currentTime >= singleEvent.startTimePublic &&
        currentTime < totalEndTime
      ) {
        setIsLiveEvents(true);
      }
    }, []);
    console.log('isLiveEvents', isLiveEvents, singleEvent, recordingAssetId);
    if (isLiveEvents) return <LiveEvents routes={routes} />;

    return recordingAssetId ? (
      <CompletedEventsWithRecording routes={routes} />
    ) : (
      <CompletedEventsWithoutRecording routes={routes} />
    );
  };

  const LiveEvents = ({ routes }) => {
    console.log(ticketAccess, ticketAccessGranted);

    return (
      <>
        {ticketAccessGranted && cookies?.tiAcc && (
          <div className={classes.SecondaryContainer}>
            <LiveVideoPlayer
              channelServiceId={singleEvent.rooms[0].serviceId}
              eventPlayer={true}
              eventId={singleEvent.eventId}
            />
          </div>
        )}

        <EventsRoomDescription liveEvent={true} routes={routes} />
      </>
    );
  };

  const FutureEvents = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
    routes,
  }) => {
    return (
      <div className={classes.EventTertairy}>
        <div className={classes.EventPrimary}>
          <div className={classes.EventSecondary}>
            <Header
              extraClassname={true}
              title={
                singleEvent?.publicName[defaultLanguage] ||
                singleEvent?.name[defaultLanguage]
              }
            />
            <div className={`${classes.EventPrimary_countdown} font-800`}>
              <div className={classes.EventPrimary_countdown_description}>
                {' '}
                <span>{zeroPad(days)}</span>
                <p className='font-300'>{t('eventsCategory.days')}</p>
              </div>
              <div className={classes.EventPrimary_countdown_description}>
                <span>{zeroPad(hours)}</span>
                <p className='font-300'>{t('eventsCategory.hours')}</p>
              </div>
              <div className={classes.EventPrimary_countdown_description}>
                <span>{zeroPad(minutes)}</span>

                <p className='font-300'>{t('eventsCategory.minutes')}</p>
              </div>
              <div className={classes.EventPrimary_countdown_description}>
                <span>{zeroPad(seconds)}</span>

                <p className='font-300'>{t('eventsCategory.seconds')}</p>
              </div>
            </div>
            <div className={classes.EventTimeDescription}>
              <div className={`${classes.EventPrimary_date} font-300`}>
                <div>
                  <FontAwesomeIcon icon='calendar' />
                </div>

                <div>{momentDate(singleEvent?.startTimePublic)}</div>
              </div>
              <div className={`${classes.EventPrimary_time} font-300`}>
                <div>
                  {' '}
                  <FontAwesomeIcon icon='clock' />
                </div>
                <div>
                  {moment(singleEvent.startTimePublic)
                    .locale('fi')
                    .format('LT')}
                </div>{' '}
              </div>
            </div>
            {ticketAccess && !ticketAccessGranted && (
              <BuyTickets routes={routes} futureEvents={true} />
            )}
            {ticketAccess && ticketAccessGranted && (
              <div className={`${classes.EventPrimary_countdown} font-600`}>
                {t('eventsCategory.eventNotStarted')}:<br />
              </div>
            )}

            <div
              className={classes.EventPrimary_description}
              dangerouslySetInnerHTML={{
                __html: singleEvent.description[defaultLanguage],
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  // This is a conditional Renndering. CompletionList will be called when the count down is over
  const Renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <CompletedEvents routes={props.routes} />;
    } else {
      return (
        <>
          <FutureEvents
            days={days}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            completed={completed}
            routes={props.routes}
          />
        </>
      );
    }
  };
  return (
    <>
      <div>
        {!loading && singleEvent && (
          <Countdown date={singleEvent.startTimePublic} renderer={Renderer} />
        )}
      </div>
    </>
  );
}
