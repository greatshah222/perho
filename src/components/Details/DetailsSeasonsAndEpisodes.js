import { useMyContext } from '../../contexts/StateHolder';
import DetailsContentRatings from './DetailsContentRatings';
import DetailsItemDescription from './DetailsItemDescription';
import { convertDuration, createToken } from '../../scripts/utils';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getEpisodes, getSubCategories } from '../../scripts/dataHandlers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loader from 'react-loader-spinner';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/fr'; // without this line it didn't work
import DetailsSeasonTitle from './DetailsSeasonTitle';

// Renders props item
const RenderSeasonsAndEpisodes = (props) => {
  // Bring stateholders from context
  const { organizationId, language, user, key, chosenItem, setChosenItem } =
    useMyContext();

  const [chosenSeason, setChosenSeason] = useState(0);

  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [serie, setSerie] = useState([]);

  const history = useHistory();

  // FETCH SERIE
  useEffect(() => {
    setLoading(true);

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    async function fetchSerie() {
      try {
        if (
          serie?.length === 0 &&
          (chosenItem?.groupItems?.length > 0 || chosenItem.seriesId)
        ) {
          // If item has groupItems array, it's main serie item with season groupItems and can use existing data
          if (chosenItem?.groupItems?.length > 0) {
            // Set chosenItem as serie
            setSerie({ ...chosenItem });
            // Set chosenItem's first season as chosenSeason
            setChosenSeason(chosenItem.groupItems[0].id);
          } else {
            // Else item is episode, so use chosenItem's seriesId to fetch data of main serie
            let token = createToken(organizationId, chosenItem.seriesId, key);

            const response = await getSubCategories(
              organizationId,
              token,
              chosenItem.seriesId,
              language,
              user,
              source
            );

            // Set response as serie
            setSerie({ ...response[0] });
            // Set first season id from chosenItem's series array as chosenSeason
            setChosenSeason(chosenItem.series[0].id);
          }
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }

    chosenItem && chosenItem !== '' && fetchSerie();

    return () => source.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, organizationId, key, props.assetProperty, user, chosenItem]);

  // FETCH EPISODES
  useEffect(() => {
    setLoading(true);

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    async function fetchEpisodes() {
      try {
        const response = await getEpisodes(
          organizationId,
          chosenSeason,
          createToken(organizationId, chosenSeason, key),
          language,
          props.assetProperty,
          user,
          source
        );

        setEpisodes(response);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }

    chosenSeason && fetchEpisodes();

    return () => source.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenSeason]);

  const changeEpisodeDetailsStyle = (clickedId) => {
    const updatedEpisodes = episodes;
    const index = updatedEpisodes.findIndex(
      (episode) => episode.id === clickedId
    );
    if (updatedEpisodes[index].isClicked === true) {
      updatedEpisodes[index].isClicked = false;
    } else {
      updatedEpisodes[index].isClicked = true;
    }
    setEpisodes([...updatedEpisodes]);
  };

  const click = (item) => {
    setChosenItem(item);
    history.push(
      `/${props.playVideoRoute}/${organizationId}/${item.id}` //${serieId}/${chosenSeason}`
    );
  };

  const renderSeasonNumbers = () => {
    if (episodes.length > 0 && serie && serie.groupItems) {
      // console.log(serie);

      return serie.groupItems.map((season, i) => {
        return (
          <button
            disabled={loading}
            className={
              Number(season.id) === Number(chosenSeason)
                ? 'seasonNumber activeSeason'
                : 'seasonNumber'
            }
            key={season.id}
            onClick={() => setChosenSeason(season.id)}
          >
            {season.title}
          </button>
        );
      });
    } else {
      loading && (
        <div className='display-flex-center'>
          <Loader type='TailSpin' color='#161eaf' />
        </div>
      );
    }
  };

  const renderSeasonContent = () => {
    // episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);
    return episodes.map((item) => {
      return (
        <div
          className={
            item.isClicked
              ? 'episodeDetailsItem isClicked'
              : 'episodeDetailsItem'
          }
          key={item.id}
        >
          <div className='episodeDetailsLeft'>
            <div className='thumbnail-container ' onClick={() => click(item)}>
              <LazyLoadImage
                effect='blur'
                className='episode-list-img'
                src={
                  item.thumbnailSmall
                    ? item.thumbnailSmall
                    : item.bannerImageSmall
                }
                alt=''
              />
            </div>
          </div>

          <div className='episodeDetailsMiddle' onClick={() => click(item)}>
            <div className='episodeDetailsMiddleTop font-300 '>
              <DetailsSeasonTitle item={item} size='120' mobileSize='60' />
              {item.duration ? (
                <div className={'info-duration  '}>
                  {convertDuration(item.duration)}
                </div>
              ) : null}
            </div>

            <div className='episodeDetailsMiddleBottom '>
              <DetailsItemDescription
                isClicked={item.isClicked}
                desc={
                  item.ingress ||
                  item.description ||
                  chosenItem?.description ||
                  chosenItem?.serie?.description
                }
                extraClassName='font-150'
                size={280}
                mobileSize={120}
                sanitizeHTML={true}
              />
              <div className='asset-date font-000'>
                {moment(item.date).locale('fr').format('l')}
              </div>
            </div>
          </div>
          {item.contentRatings?.length > 0 && (
            <div className='episodeDetailsRight'>
              <DetailsContentRatings item={item} />
            </div>
          )}
        </div>
      );
    });
  };

  return chosenItem && episodes?.length > 0 ? (
    <div className='seasonsAndEpisodesContainer'>
      <div className='series-seasons-container'>
        <div className='series-seasons-numbers font-400'>
          {renderSeasonNumbers()}
        </div>
      </div>

      <div className='series-episode-list'>
        {loading ? (
          <div className='display-flex-center'>
            <Loader type='TailSpin' color='#161eaf' />
          </div>
        ) : (
          renderSeasonContent()
        )}
      </div>
    </div>
  ) : (
    <div className='display-flex-center'>
      <Loader type='TailSpin' color='#161eaf' />
    </div>
  );
};

export default RenderSeasonsAndEpisodes;
