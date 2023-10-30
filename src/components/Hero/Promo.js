import React, { useEffect } from 'react';
import { useMyContext } from '../../contexts/StateHolder';
import { getPromo } from '../../scripts/dataHandlers';
import { createToken } from '../../scripts/utils';
import VideoHero from '../VideoComponent/VideoHero';
import * as classes from './HeroBanner.module.css';
import { useHistory } from 'react-router-dom';

export default function Promo(props) {
  const history = useHistory();

  const {
    key,
    language,
    organizationId,
    setChosenItem,
    setChosenCategory,
    promoItems,
    setPromoItems,
  } = useMyContext();
  // DOnt show category name in Promo

  const { id, groupItemId, routes } = props.settings;

  useEffect(() => {
    async function getData() {
      try {
        const token = createToken(organizationId, groupItemId, key);

        const response = await getPromo(
          organizationId,
          groupItemId,
          token,
          language,
          4
        );

        // Set allItems as newAllItems
        let newAllItems = { ...promoItems };
        newAllItems[id] = response;

        // Set newItems to allItems context stateholder
        setPromoItems(newAllItems);
      } catch (err) {
        console.log(err);
      }
    }

    if (organizationId && groupItemId && key && language && !promoItems[id]) {
      getData();
    }
  }, [
    groupItemId,
    id,
    key,
    language,
    organizationId,
    promoItems,
    setPromoItems,
  ]);

  const clickItem = (item) => {
    // Set chosenItem
    setChosenItem(item);

    // When item is clicked, set chosen category
    setChosenCategory({ id: item.groupItemIds, title: item.groups });

    // Switch to details screen if video, seriesDetails if serie
    item.isSerie
      ? history.push(`/${routes.serieRoute}/${item.id}`)
      : history.push(
          `/${routes.videoRoute}/organizationId/${organizationId}/assetId/${item.id}`
        );
  };

  return (
    <div className={classes.primarycontainer_Promo}>
      <div className={classes.secondaryContainer} style={props.style}>
        <div className={classes.container_multipleItem}>
          {promoItems[id] &&
            promoItems[id].map((el) => (
              <VideoHero
                key={el.id}
                imageNameWeb={
                  el.thumbnailMedium ? el.thumbnailMedium : el.thumbnailSmall
                }
                title={el.name}
                onClick={() => clickItem(el)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
