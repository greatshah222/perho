import React, { useEffect, useState } from 'react';
import { useMyContext } from '../../contexts/StateHolder';
import { getBanner, getPromo } from '../../scripts/dataHandlers';
import { createToken } from '../../scripts/utils';
import * as classes from './HeroBanner.module.css';
import Banner from './Banner';
import Promo from './Promo';
import { useHistory } from 'react-router-dom';

export default function HeroBanner(props) {
  const [loading, setLoading] = useState(true);
  // Bring stateholders from context
  const {
    bannerItems,
    setBannerItems,
    key,
    language,
    organizationId,
    setChosenItem,
    setChosenCategory,
    promoItems,
    setPromoItems,
  } = useMyContext();

  // Destructure props.settings
  const { id, groupItemId, routes } = props.settings;
  console.log(bannerItems, id);

  useEffect(() => {
    async function getData() {
      try {
        // Create token for promo items
        const tokenBanner = createToken(organizationId, groupItemId, key);
        const tokenPromo = createToken('124292109', '126939856', 'meHhZZLdX8');

        // Call getItems datahandler to get list of items from categories
        const responseBanner = await getBanner(
          organizationId,
          groupItemId,
          tokenBanner,
          language
        );
        const responsePromo = await getPromo(
          '124292109',
          '126939856',
          tokenPromo,
          language,
          4
        );
        console.log(`responseBanner`, responseBanner);
        console.log(`responsePromo `, responsePromo);

        // Set allItems as newAllItems
        let newBannerItems = { ...bannerItems };
        newBannerItems[id] =
          responseBanner[Math.floor(Math.random() * responseBanner.length)];

        // Set newItems to allItems context stateholder
        setBannerItems(newBannerItems);
        setPromoItems(responsePromo);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }

    if (organizationId && groupItemId && key && language && !bannerItems[id]) {
      getData();
    } else {
      organizationId && setLoading(false);
    }
  }, [
    bannerItems,
    groupItemId,
    id,
    key,
    language,
    organizationId,
    setBannerItems,
    setPromoItems,
  ]);

  console.log(bannerItems, promoItems, 'bannerItems');
  const history = useHistory();
  const clickItem = (item) => {
    console.log(item);
    // Set chosenItem
    setChosenItem(item);

    // When item is clicked, set chosen category
    setChosenCategory({ id: item.groupItemIds, title: item.groups });

    //let vod = checkVod(routes, location.pathname);

    /* If asset has set pageUrl, redirect to that location.
    Otherwise if asset isSerie, redirect to serie route and if not, redirect to movie route */
    if (item.pageUrl) {
      window.location.href = item.pageUrl;
    } else if (item.isSerie) {
      history.push(`/${routes.serieRoute}/${item.serie.id}`);
    } else if (!item.isSerie) {
      // history.push(`/${routes.videoRoute}/${item.id}`);
      history.push(
        `/${routes.videoRoute}/organizationId/${organizationId}/assetId/${item.id}`
      );
    } else {
      // Do nothing
    }
  };

  return (
    !loading &&
    bannerItems[id] && (
      <div className={classes.primarycontainer}>
        <div className={classes.secondaryContainer} style={props.style}>
          <Banner
            style={props.style}
            hideActions={bannerItems[id].duration ? false : true}
            imageNameWeb={bannerItems[id].bannerImageLarge}
            bannerHeading={bannerItems[id].name}
            onClick={() => clickItem(bannerItems[id])}
          />
        </div>
      </div>
    )
  );
}
