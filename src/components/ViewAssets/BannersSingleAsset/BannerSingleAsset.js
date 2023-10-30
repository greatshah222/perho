import { useMyContext } from '../../../contexts/StateHolder';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBanner } from '../../../scripts/dataHandlers';
import { createToken, shuffle } from '../../../scripts/utils';
import ChildItem1 from './ChildItems/ChildItem1';

const BannerSingleAsset = (props) => {
  // Destructure props.settings
  const { groupItemId, routes, bannerComponent } =
    props.settings;

  // Destructure props.styles
  const { styles } = props.styles;

  const [bannerItem, setBannerItem] = useState("");

  // Bring stateholders from context
  const {
    key,
    language,
    organizationId,
    setChosenItem,
    setChosenCategory,
    user,
  } = useMyContext();

  const history = useHistory();

  // List of usable item title and image components
  const components = {
    ChildItem1,
  };

  useEffect(() => {
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
          user
        );

        const shuffledArray = shuffle(response);

        // Set newItems to allItems context stateholder
        setBannerItem(shuffledArray[0]);
      } catch (err) {
        console.log(err);
      }
    }

    if (organizationId && groupItemId && key && language) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const clickItem = (item) => {
    console.log(item);
    // Set chosenItem
    setChosenItem(item);

    // When item is clicked, set chosen category
    setChosenCategory({ id: item.groupItemIds, title: item.groups });

    /* If asset has set pageUrl, redirect to that location.
        Otherwise if asset isSerie, redirect to serie route and if not, redirect to movie route */
    if (item.pageUrl !== '') {
      //   window.location.href = item.pageUrl;
    } else if (item.isSerie) {
      history.push(`/${routes.serieRoute}/${item.serie.id}`);
    } else if (!item.isSerie) {
      history.push(`/${routes.videoRoute}/${item.id}`);
    } else {
      // Do nothing
    }
  };
  
  const RenderBannerComponent = components[bannerComponent];

  if (bannerItem) {
    console.log(bannerItem)
    return (
      <div className='bannerContainer' style={styles?.bannerContainer}>
        <RenderBannerComponent
                  clickItem={clickItem}
                  item={bannerItem}
                  id={bannerItem.id}
                  key={bannerItem.id}
                  styles={styles}
        />
      </div>
    );
  } else {
    return null;
  }
};

export default BannerSingleAsset;
