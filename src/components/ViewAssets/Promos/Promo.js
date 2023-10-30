import { useMyContext } from '../../../contexts/StateHolder';
import { useEffect } from 'react';
import { getPromo } from '../../../scripts/dataHandlers';
import { createToken } from '../../../scripts/utils';
import RenderItem from '../RenderItems/RenderItem';
import axios from 'axios';
import * as classes from './Promo.module.css';

const Promo = (props) => {
  // Destructure props.settings
  const {
    id,
    groupItemId,
    routes,
    assetProperty,
    itemImageComponent,
    itemTitleComponent,
    maintainImageAspectRatio,
    cutText
  } = props.settings;

  // Bring stateholders from context
  const { promoItems, setPromoItems, key, language, organizationId, user } =
    useMyContext();

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    async function getData() {
      try {
        // Create token for promo items
        const token = createToken(organizationId, groupItemId, key);

        // Call getItems datahandler to get list of items from categories
        const response = await getPromo(
          organizationId,
          groupItemId,
          token,
          language,
          assetProperty,
          user,
          source
        );

        // Set allItems as newAllItems
        let newAllItems = { ...promoItems };

        // Add fetched itemList to newAllItems key value (component id = key)
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

    return () => source.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const renderPromo = () => {
    // Map through every category and render titles + content under it
    return promoItems[id].map((item, i) => {
      return (
        <RenderItem
          key={`${id} ${i}`}
          item={item}
          pushRoute={`/${routes.videoRoute}/${organizationId}/${item.id}`} //${item.seriesId}/${item.series[0].id}`}
          playOnClick={true}
          itemImageComponent={itemImageComponent}
          itemTitleComponent={itemTitleComponent}
          showCategoryName={true}
          showPlayIcon={true}
          // whether to maintain aspect ratio 16/9
          maintainImageAspectRatio={maintainImageAspectRatio}
          textStyle={{ justifyContent: 'center', textAlign: 'center' }}
          cutText={cutText}
        />
      );
    });
  };

  if (promoItems[id]?.length > 0) {
    return (
      <div className={classes.primarycontainer_Promo}>
        <div className={classes.secondaryContainer} style={props.style}>
          <div className={classes.container_multipleItem}>
            {promoItems[id] ? renderPromo() : null}
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Promo;
