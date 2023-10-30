import { useMyContext } from '../../../contexts/StateHolder';

import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBanner } from '../../../scripts/dataHandlers';
import { createToken } from '../../../scripts/utils';
import RenderBanner from './RenderBanner/RenderBanner';
import RenderBanner1 from './RenderBanner1/RenderBanner1';
import RenderBanner2 from './RenderBanner1/RenderBanner2';
// import Carousel from 'react-multi-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import useWindowDimensions from '../../WindowDimension';

import React from 'react';
//import ReactGA from 'react-ga';

import axios from 'axios';

const Banner = (props) => {
  // Destructure props.settings
  const {
    id,
    groupItemId,
    routes,
    bannerComponent,
    slickSettings,
    showDuration,
    showTitle,
    showActionButton,
  } = props.settings;

  console.log(props);
  // Bring stateholders from context
  const {
    bannerItems,
    setBannerItems,
    key,
    language,
    organizationId,
    setChosenItem,
    setChosenCategory,
    user,
  } = useMyContext();
  const [deviceType, setDeviceType] = useState(null);

  const windowDimension = useWindowDimensions();

  const history = useHistory();

  // List of usable item title and image components
  const components = {
    RenderBanner,
    RenderBanner1,
    RenderBanner2,
  };
  useEffect(() => {
    if (windowDimension.width <= 550) {
      setDeviceType('mobile');
    } else {
      setDeviceType(null);
    }
  }, [windowDimension.width]);
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    async function getData() {
      try {
        // Create token for promo items
        const token = createToken(organizationId, groupItemId, key);

        // Call getItems datahandler to get list of items from categories
        const response = await getBanner(
          organizationId,
          groupItemId,
          token,
          language,
          user,
          source
        );
        console.log(response);
        // Set allItems as newAllItems
        let newBannerItems = { ...bannerItems };

        // Add fetched itemList to newAllItems key value (component id = key)
        newBannerItems[id] = response;

        console.log(newBannerItems, 'newBannerItems');

        // Set newItems to allItems context stateholder
        setBannerItems(newBannerItems);
      } catch (err) {
        console.log(err);
      }
    }

    if (organizationId && groupItemId && key && language && !bannerItems[id]) {
      getData();
    }

    return () => source.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const clickItem = (item) => {
    if (!props.justImage) {
      // Set chosenItem
      setChosenItem(item);

      // When item is clicked, set chosen category
      setChosenCategory({ id: item.groupItemIds, title: item.groups });

      /*
      // Report GA about clicked asset
      ReactGA.event({
        category: 'Banner',
        action: `Clicked banner ${item.id} from ${window.location.pathname}`,
      });
      */

      /* 
        2. If asset has set pageUrl, redirect to that location.
        3. Otherwise if asset isSerie, redirect to serie route 
        4. If not, redirect to movie route 
      */
      if (item.pageUrl !== '') {
        // Absolute or relative path -checker
        const urlRegExp = /^https?:\/\//i;
        if (urlRegExp.test(item.pageUrl)) {
          // Is absolute path, redirect user to location
          window.location.href = item.pageUrl;
        } else {
          // Is relative path, push to relative path
          history.push(item.pageUrl);
        }
      } else if (item.isSerie) {
        history.push(
          `/${routes.serieRoute}/${organizationId}/${item.id}` //${item.seriesId}/${item.series[0].id}`
        );
      } else if (item.groupItemIds.length > 0) {
        history.push(`/${routes.categories}/${organizationId}/${item.id}`);
      } else if (!item.isSerie) {
        history.push(`/${routes.videoRoute}/${item.id}`);
      } else {
        // Do nothing
      }
    }
  };

  const RenderBannerComponent = components[bannerComponent];

  if (bannerItems[id]) {
    return (
      <div className='bannerContainer'>
        <Carousel
          {...slickSettings}
          centerMode={!deviceType ? true : false}
          centerSlidePercentage={slickSettings.centerSlidePercentage}
          showArrows={!deviceType ? true : false}
        >
          {bannerItems[id]
            ? bannerItems[id].map((el) => {
                el.isSerie = el?.series?.length > 0 ? true : false;
                return (
                  <RenderBannerComponent
                    clickItem={clickItem}
                    item={el}
                    id={el.id}
                    key={el.id}
                    deviceType={deviceType}
                    showDuration={showDuration}
                    showtitle={showTitle}
                    showActionButton={showActionButton}
                  />
                );
              })
            : null}
        </Carousel>
      </div>
    );
  } else {
    return null;
  }
};

export default Banner;
