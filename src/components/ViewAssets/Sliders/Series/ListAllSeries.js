import React from 'react';
import { useEffect, useState } from 'react';
import { getSeries } from '../../../../scripts/dataHandlers';
import { useMyContext } from '../../../../contexts/StateHolder';
import RenderItem from '../../RenderItems/RenderItem';
import * as classes from './ListAllSeries.module.css';
import Carousel from 'react-multi-carousel';
import CategoryTitle from '../../CategoryTitles/CategoryTitle';
import CategoryTitle2 from '../../CategoryTitles/CategoryTitle2/CategoryTitle2';
import axios from 'axios';

export default function ListAllCategories(props) {
  const { organizationId, key, language, user } = useMyContext();

  // List of usable category components
  const components = {
    CategoryTitle,
    CategoryTitle2,
  };

  const {
    slickSettings,
    routes,
    itemImageComponent,
    itemTitleComponent,
    categoryTitleComponent,
    assetProperty,
    cutText
  } = props.settings;

  console.log(props);
  console.log(components);

  const [allSubCategories, setAllSubCategories] = useState(null);
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const getData = async () => {
      const res = await getSeries(
        organizationId,
        key,
        language,
        user,
        assetProperty,
        source
      );

      setAllSubCategories(res);
    };
    organizationId && key && getData();

    return () => source.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, user]);

  // Choose child component for Title
  const CategoryTitleComponent = components[categoryTitleComponent];

  return (
    <div className={classes.allSeriesContainer}>
      {allSubCategories && allSubCategories.length > 0 && (
        <div className={`${classes.ListAllCategories} font-500`}>
          <CategoryTitleComponent
            id={'123456789098765421'}
            title={props.titleName}
            routes={routes}
            item={null}
            showSerieViewAll={true}
            isSerie={true}
            showTitle={true}
          />
          <Carousel {...slickSettings} infinite={false}>
            {allSubCategories.map((item) => {
              item.isSerie = true;
              item.series = item.groupItems;
              item.serieId = item.id;
              item.listSerieItem = true;
              return (
                <RenderItem
                  key={`${item.id}`}
                  item={item}
                  imageType={"thumbnailSerie"}
                  pushRoute={`/${routes.serieRoute}/${organizationId}/${item.id}`}//${item.serieId}/${item.series[0].id}`}
                  itemImageComponent={itemImageComponent}
                  itemTitleComponent={itemTitleComponent}
                  textStyle={{ textAlign: 'center' }}
                  renderCategory={true}
                  showPlayIcon={true}
                  hidePlayButton={true}
                  cutText={cutText}
                />
              );
            })}
          </Carousel>
        </div>
      )}
    </div>
  );
}
