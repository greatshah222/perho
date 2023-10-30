import { useMyContext } from '../../../contexts/StateHolder';
import RenderItem from '../RenderItems/RenderItem';
import CategoryTitle from '../CategoryTitles/CategoryTitle';
import CategoryTitle2 from '../CategoryTitles/CategoryTitle2/CategoryTitle2';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { getSimilar } from '../../../scripts/dataHandlers';
import { createToken } from '../../../scripts/utils';
import Carousel from 'react-multi-carousel';
import * as classes from './CategoryContentSimilar.module.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// List of usable category components
const components = {
  CategoryTitle,
  CategoryTitle2,
};

const CategoryContentSimilar = (props) => {
  // Destructure props.settings
  const {
    routes,
    slickSettings,
    assetProperty,
    categoryTitleComponent,
    itemImageComponent,
    itemTitleComponent,
    imageType,
    maintainImageAspectRatio,
    cutText,
  } = props.settings;

  // Bring stateholders from context
  const { chosenItem, key, language, organizationId, user } = useMyContext();

  const { t } = useTranslation();

  const { asset } = useParams();

  const [items, setItems] = useState([]);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    async function getData() {
      try {
        // Create token for items
        const token = createToken(organizationId, chosenItem.groupItemIds, key);

        // Call getSimilar datahandler to get list of items from categories
        const response = await getSimilar(
          organizationId,
          chosenItem.groupItemIds,
          token,
          language,
          assetProperty,
          user
        );

        console.log('response', response);

        // Set items in holder
        setItems(response);
      } catch (err) {
        console.log(err);
      }
    }
    if (chosenItem) {
      getData();
    }

    return () => source.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenItem, language]);

  const renderSimilar = () => {
    // Choose child component for title
    const TitleComponent = components[categoryTitleComponent];

    return items?.length > 1 ? (
      <div className={classes.similarContainer}>
        <TitleComponent title={t('similarSlider.title')} extraClassname />

        <Carousel {...slickSettings}>
          {items.map((item, i) => {
            let pushRoute = '';
            if (item.isSerie === true) {
              pushRoute = `/${routes.serieRoute}/${organizationId}/${item.id}`; //${item.series[0].id}${item?.series[1]?.id ? "/" + item.series[1].id : ""}`
            } else {
              pushRoute = `/${routes.videoRoute}/${organizationId}/${item.id}`;
            }

            return Number(item.id) !== Number(asset) ? (
              <RenderItem
                key={i}
                item={item}
                routes={routes}
                itemImageComponent={itemImageComponent}
                itemTitleComponent={itemTitleComponent}
                pushRoute={pushRoute}
                imageType={imageType}
                showCategoryName={true}
                showPlayIcon={true}
                // whether to maintain aspect ratio 16/9
                maintainImageAspectRatio={maintainImageAspectRatio}
                showDuration={true}
                showReleaseYear={true}
                cutText={cutText}
              />
            ) : null;
          })}
        </Carousel>
      </div>
    ) : null;
  };

  return chosenItem && Object.keys(chosenItem).length > 0 && items?.length > 0
    ? renderSimilar()
    : null;
};

export default CategoryContentSimilar;
