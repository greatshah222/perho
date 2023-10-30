import { useMyContext } from '../../../contexts/StateHolder';
import RenderItem from '../RenderItems/RenderItem';
import CategoryTitle from '../CategoryTitles/CategoryTitle';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAssets, getSubCategories } from '../../../scripts/dataHandlers';
import { createToken } from '../../../scripts/utils';
import * as classes from './ChosenCategoryGrid.module.css';
import CategoryTitle2 from '../CategoryTitles/CategoryTitle2/CategoryTitle2';
import axios from 'axios';

const ChosenCategoryGrid = (props) => {
  // List of usable category components
  const components = {
    CategoryTitle,
    CategoryTitle2,
  };

  // Destructure props.settings
  const {
    routes,
    assetProperty,
    categoryTitleComponent,
    itemImageComponent,
    itemTitleComponent,
    imageType,
    maintainImageAspectRatio,
    preDefinedCategory,
    cutText
  } = props.settings;

  // Bring stateholders from context
  const {
    chosenCategory,
    key,
    language,
    organizationId,
    user,
    setChosenTab,
  } = useMyContext();

  const [items, setItems] = useState([]);

  const [categoryName, setCategoryName] = useState([]);

  const { asset } = useParams();

  useEffect(() => {

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    async function getData() {
      try {

        console.log(preDefinedCategory);
        // If component has predefined groupId in configs, use that
        const groupId = preDefinedCategory && preDefinedCategory !== "" ? preDefinedCategory : asset;

        // Call createToken function to create new token from given data
        const token = createToken(organizationId, groupId, key);

        const response = await getSubCategories(organizationId, token, groupId, language, user, source);

        // Call getAssets datahandler to get list of all items from category
        const itemList = await getAssets(
          organizationId,
          groupId,
          token,
          language,
          assetProperty,
          user,
          source
        );

        // Find categoryname by asset id number from itemList and set it in stateholder of categoryName
        setCategoryName(response[0].title);

        // Set items in stateHolder
        setItems(itemList);
      } catch (err) {
        console.log(err);
      }
    }
    if (language !== "") {
      getData();
    }
    return () => {
      source.cancel();
      // Unbind the event listener on clean up
      setChosenTab(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, chosenCategory, asset]);

  const renderChosenCategoryGrid = () => {
    // Map through category of items, showing clickable image of each item
    return items.map((item, i) => {

      let pushRoute = "";
      if (item.isSerie === true) {
        pushRoute = `/${routes.serieRoute}/${organizationId}/${item.id}` //${item.series[0].id}${item?.series[1]?.id ? "/" + item.series[1].id : ""}`
      } else {
        pushRoute = `/${routes.videoRoute}/${organizationId}/${item.id}`
      }

      return (
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
      );
    });
  };

  // Choose child component for title
  const TitleComponent = components[categoryTitleComponent];

  return (
    <div className={classes.chosenCategoryGrid}>
      <TitleComponent
        title={chosenCategory.title ? chosenCategory.title : categoryName}
        styles={{
          justifyContent: 'center',
          paddingBottom: '50px',
        }}
        // for Category2
        item={chosenCategory}
        extraClassname={true}
      />

      <div
        className={classes.ViewedSectionSecondary__3videos}
        style={props.styles?.categoryGridContainer}
      >
        {items ? renderChosenCategoryGrid() : null}
      </div>
    </div>
  );
};

export default ChosenCategoryGrid;
