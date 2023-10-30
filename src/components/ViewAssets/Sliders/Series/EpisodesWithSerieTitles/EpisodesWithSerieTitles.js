import { useMyContext } from '../../../../../contexts/StateHolder';
import RenderItem from '../../../RenderItems/RenderItem';
import CategoryTitle from '../../../CategoryTitles/CategoryTitle';
import CategoryTitle2 from '../../../CategoryTitles/CategoryTitle2/CategoryTitle2';
import { useEffect, useState } from 'react';
import {
  getSeries,
  getEpisodes,
  getSeriesGroup,
} from '../../../../../scripts/dataHandlers';
import { createToken, createGroupItemId } from '../../../../../scripts/utils';
import Carousel from 'react-multi-carousel';
import * as classes from './EpisodesWithSerieTitles.module.css';
import axios from 'axios';
//import { FiCloudLightning } from 'react-icons/fi';
import useWindowDimensions from '../../../../WindowDimension';

// List of usable category components
const components = {
  CategoryTitle,
  CategoryTitle2,
};
/*
Fetch: getAssets with props.groupItemId
Renders: props categories with title and content in slick slider
*/
const EpisodesWithSerieTitles = (props) => {
  const windowDimension = useWindowDimensions();

  // Destructure props.settings
  const {
    id,
    routes,
    slickSettings,
    assetProperty,
    categoryTitleComponent,
    itemImageComponent,
    itemTitleComponent,
    maintainImageAspectRatio,
    groupItemId,
  } = props.settings;

  const [allSerieItems, setAllSerieItems] = useState([]);

  //const [orderArray, setOrderArray] = useState([]);

  // Bring stateholders from context
  const { organizationId, key, language, user } = useMyContext(); // + allCategoryItems, setAllCategoryItems when using context

  const placeholderItem = {
    id: '123456789087654321',
    name: 'placeholderItem',
  };

  const placeHolderArray = [
    placeholderItem,
    placeholderItem,
    placeholderItem,
    placeholderItem,
    placeholderItem,
    placeholderItem,
    placeholderItem,
  ];

  // UseEffect that will check mode and context data by id, if component has already fetched items once
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const getDataFromAPI = async () => {
      try {
        // If component has groupItemId set, get chosen series
        const res =
          groupItemId && groupItemId !== ''
            ? await getSeriesGroup(
                organizationId,
                groupItemId,
                language,
                user,
                source
              )
            : // If not, get them all
              await getSeries(
                organizationId,
                key,
                language,
                user,
                assetProperty,
                source
              );

        const newOrderArray = res;

        setAllSerieItems([...newOrderArray]);

        await Promise.all(
          res.map(async (serie) => {
            try {
              const groupIdString = createGroupItemId(serie.groupItems);

              // Call createToken function to create new token from given data
              let serieToken = createToken(organizationId, groupIdString, key);

              // Get episodes for series
              const response = await getEpisodes(
                organizationId,
                groupIdString,
                serieToken,
                language,
                props.assetProperty,
                user,
                source
              );

              newOrderArray.map((item) => {
                if (item.id === serie.id) {
                  item.episodes = response;
                }
                return item;
              });

              // and response need to be added into final response array
              setAllSerieItems([...newOrderArray]);
            } catch (error) {
              console.log('error' + error);
            }
          })
        );
      } catch (err) {
        console.log(err);
      }
    };

    if (organizationId && key && language && slickSettings) {
      getDataFromAPI();
    }

    return () => source.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, organizationId, key]);
  let className1 = '';

  const renderSeasons = () => {
    return allSerieItems.map((serie) => {
      console.log(`serie`, serie);
      // Choose child component for Title
      const TitleComponent = components[categoryTitleComponent];

      //if (serie?.episodes?.length > 0) {
      // Sort by publishdate
      // serie.episodes.sort((a, b) => a.date - b.date);
      /*
        serie.assets.sort((a, b) => {
          if (a.seasonNumber < b.seasonNumber) {
            return -1;
          } else if (a.seasonNumber > b.seasonNumber) {
            return 1;
          } else {
            return a.episodeNumber - b.episodeNumber;
          }
        });
        */
      // }

      if (serie?.episodes?.length > 0 && slickSettings) {
        let arr = Object.keys(slickSettings.responsive).map(
          (k) => slickSettings.responsive[k]
        );
        let arr1 = [...arr];

        let j = [...arr1].find(
          (el) =>
            el.breakpoint.min <= windowDimension.width &&
            el.breakpoint.max >= windowDimension.width
        );
        console.log(
          serie?.episodes.length === j.items,
          serie?.episodes.length,
          j.items
        );
        if (serie?.episodes.length === j.items) {
          className1 = 'addSeecondary';
        } else {
          className1 = '';
        }
      }

      return (
        <div
          className={`${classes.categoriesContainer} ${className1}`}
          key={`${serie.id}`}
        >
          <TitleComponent
            id={serie.id}
            title={serie.title}
            routes={routes}
            item={serie}
            showSerieViewAll={true}
            isSerie={true}
          />
          {serie?.episodes?.length > 0 ? (
            <Carousel {...slickSettings}>
              {serie.episodes.map((item, i) => {
                return (
                  <RenderItem
                    key={`${id} ${i}`}
                    item={item}
                    pushRoute={`/${routes.serieRoute}/${organizationId}/${item.id}`} //${item.seriesId}/${item.series[0].id}`}
                    playOnClick={true}
                    itemImageComponent={itemImageComponent}
                    itemTitleComponent={itemTitleComponent}
                    imageType={'thumbnail'}
                    showCategoryName={false}
                    showPlayIcon={true}
                    showDuration={props.showDuration}
                    showReleaseYear={props.showReleaseYear}
                    // whether to maintain aspect ratio 16/9
                    maintainImageAspectRatio={maintainImageAspectRatio}
                  />
                );
              })}
            </Carousel>
          ) : (
            <Carousel {...slickSettings}>
              {placeHolderArray.map((item, i) => {
                return (
                  <RenderItem
                    key={`${id} ${i}`}
                    item={item}
                    routes={routes}
                    playOnClick={false}
                    itemImageComponent={itemImageComponent}
                    itemTitleComponent={itemTitleComponent}
                    showCategoryName={false}
                    showPlayIcon={false}
                    // whether to maintain aspect ratio 16/9
                    maintainImageAspectRatio={maintainImageAspectRatio}
                    isSerie={false}
                  />
                );
              })}
            </Carousel>
          )}
        </div>
      );
    });
  };
  return allSerieItems.length > 0 ? renderSeasons() : null;
};

export default EpisodesWithSerieTitles;
