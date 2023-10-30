import React, { useEffect, useState } from 'react';
import { useMyContext } from '../../../../../contexts/StateHolder';
import {
  getLatestAssets,
  getTrendingAssets,
} from '../../../../../scripts/dataHandlers';
import { createToken } from '../../../../../scripts/utils';
import CategoryTitle from '../../../CategoryTitles/CategoryTitle';
import CategoryTitle2 from '../../../CategoryTitles/CategoryTitle2/CategoryTitle2';
import useWindowDimensions from '../../../../WindowDimension';
import Carousel from 'react-multi-carousel';

import RenderItem from '../../../RenderItems/RenderItem';

const components = {
  CategoryTitle,
  CategoryTitle2,
};

export default function SeriesAsset(props) {
  const { organizationId, key, language } = useMyContext();
  // Destructure props.settings
  const {
    id,
    routes,
    slickSettings,
    categoryTitleComponent,
    itemImageComponent,
    itemTitleComponent,
    maintainImageAspectRatio,
    days,
    limit,
  } = props.settings;

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

  const [items, setItems] = useState(null);

  const windowDimension = useWindowDimensions();

  useEffect(() => {
    let token;
    const fetchLatestData = async () => {
      const res = await getLatestAssets(organizationId, token, language, limit);
      setItems(res?.assets);
    };

    const fetchPopularData = async () => {
      const res = await getTrendingAssets(
        organizationId,
        token,
        language,
        limit,
        days
      );
      setItems(res);
    };
    if (organizationId && language) {
      token = createToken(organizationId, '', key);

      if (token) {
        props.latestData ? fetchLatestData() : fetchPopularData();
      }
    }
  }, [language, organizationId, key, props.latestData, days, limit]);
  let className1 = '';

  const renderItems = () => {
    const TitleComponent = components[categoryTitleComponent];

    if (items?.length > 0 && slickSettings) {
      let arr = Object.keys(slickSettings.responsive).map(
        (k) => slickSettings.responsive[k]
      );
      let arr1 = [...arr];

      let j = [...arr1].find(
        (el) =>
          el.breakpoint.min <= windowDimension.width &&
          el.breakpoint.max >= windowDimension.width
      );

      if (items?.length === j.items) {
        className1 = 'addSeecondary';
      } else {
        className1 = '';
      }
    }

    return (
      <div className={`${className1}`}>
        <TitleComponent
          id={'123456789098765421'}
          title={props.titleName}
          routes={routes}
          item={null}
          showSerieViewAll={false}
          isSerie={true}
          showTitle={true}
          extraClassname={props.extraClassname}
        />
        {items?.length > 0 ? (
          <Carousel {...slickSettings}>
            {items.map((item, i) => {
              let pushRoute = '';
              console.log(item);
              if (item.isSerie === true) {
                pushRoute = `/${routes.serieRoute}/${organizationId}/${item.id}`; //${item.series[0].id}${item?.series[1]?.id ? "/"+item.series[1].id : ""}`
              } else {
                pushRoute = `/${routes.videoRoute}/${organizationId}/${item.id}`;
              }
              return (
                <RenderItem
                  key={`${id} ${i}`}
                  item={item}
                  pushRoute={pushRoute}
                  //${item.seriesId}/${item.series[0].id}`}
                  playOnClick={true}
                  itemImageComponent={itemImageComponent}
                  itemTitleComponent={itemTitleComponent}
                  imageType={'thumbnail'}
                  showCategoryName={true}
                  showPlayIcon={true}
                  showDuration={props.showDuration}
                  showReleaseYear={props.showReleaseYear}
                  // whether to maintain aspect ratio 16/9
                  maintainImageAspectRatio={maintainImageAspectRatio}
                  isSerie={true}
                  showPublishedDate={props.showPublishedDate}
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
  };
  return renderItems();
}
