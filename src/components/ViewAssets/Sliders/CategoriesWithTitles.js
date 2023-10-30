import { useMyContext } from '../../../contexts/StateHolder';
import RenderItem from '../RenderItems/RenderItem';
import CategoryTitle from '../CategoryTitles/CategoryTitle';
import CategoryTitle2 from '../CategoryTitles/CategoryTitle2/CategoryTitle2';
import { useEffect, useState } from 'react';
import {
  getAssets,
  getSubCategories,
  getRootSubCategories,
} from '../../../scripts/dataHandlers';
import { createToken, createGroupItemId } from '../../../scripts/utils';
import Carousel from 'react-multi-carousel';
import * as classes from './CategoriesWithTitles.module.css';
import axios from 'axios';

// List of usable category components
const components = {
  CategoryTitle,
  CategoryTitle2,
};
/*
Fetch: getAssets with props.groupItemId
Renders: props categories with title and content in slick slider
*/
const CategoriesWithTitles = (props) => {
  console.log(props);
  // Destructure props.settings
  const {
    id,
    mode,
    groupItemId,
    routes,
    slickSettings,
    assetProperty,
    categoryTitleComponent,
    itemImageComponent,
    itemTitleComponent,
    maintainImageAspectRatio,
    imageType,
    cutText,
  } = props.settings;

  const [allCategoryItems, setAllCategoryItems] = useState([]);

  // Bring stateholders from context
  const { allCategories, organizationId, key, language, user } = useMyContext(); // + allCategoryItems, setAllCategoryItems when using context

  // UseEffect that will check mode and context data by id, if component has already fetched items once
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const getDataFromAPI = async () => {
      try {
        /*       TODO: Outdated guide (?)
                mode 1: show listed categories in config or from request
                mode 2: read orgId from request or from config file, and list all top level categories of that organisation
                mode 3: read root categoryId from request or config file, this will show hidden categorynames on assets
                mode 4: get subcategories and their assets, ignoring hidden categories from asset folders
                */

        let objectData = [];

        if (mode === 'mode_1') {
          // Create token
          const token = createToken(organizationId, groupItemId, key);

          // Create list of categories
          const catList = await getSubCategories(
            organizationId,
            token,
            groupItemId,
            language,
            user,
            source
          );

          // Call getAssets datahandler to get list of all items from all categories
          const itemList = await getAssets(
            organizationId,
            groupItemId,
            token,
            language,
            assetProperty,
            user,
            source
          );

          // Go through categorylist and find assets that share same id than category
          catList.forEach((cat) => {
            const assetsInCategory = itemList.filter((asset) =>
              asset.groupItemIds.includes(String(cat.id))
            );

            // Add object in objectData array, with categoryName and assets of it
            objectData.push({ category: cat, assets: assetsInCategory });
          });
        } else if (mode === 'mode_2') {
          // Create idString from all categories (category[0].id,category[1].id...)
          const idString = createGroupItemId(allCategories);

          // Create token
          const token = createToken(organizationId, idString, key);

          let response = await getAssets(
            organizationId,
            idString,
            token,
            language,
            assetProperty,
            user,
            source
          );

          // Go through categorylist and find assets that share same id than category
          allCategories.forEach((cat) => {
            const assetsInCategory = response.filter((asset) =>
              asset.groupItemIds.includes(String(cat.id))
            );

            // Add object in objectData array, with categoryName and assets of it
            objectData.push({ category: cat, assets: assetsInCategory });
          });
        } else if (mode === 'mode_3') {
          // Get root category id from config and fetch list of subcategories
          const subCatList = await getRootSubCategories(
            organizationId,
            key,
            language,
            groupItemId,
            user,
            source
          );

          // Create groupItemId from list of subcategories
          const idString = createGroupItemId(subCatList);

          // Create token
          const token = createToken(organizationId, idString, key);

          let response = await getAssets(
            organizationId,
            groupItemId,
            token,
            language,
            assetProperty,
            user,
            source
          );

          // Go through categorylist and find assets that share same id than category
          subCatList.forEach((cat) => {
            const assetsInCategory = response.filter((asset) =>
              asset.groupItemIds.includes(String(cat.id))
            );

            // Add object in objectData array, with categoryName and assets of it
            objectData.push({ category: cat, assets: assetsInCategory });
          });
        } else if (mode === 'mode_4') {
          // Create token
          const token = createToken(organizationId, groupItemId, key);

          // Create list of categories
          const catList = await getSubCategories(
            organizationId,
            token,
            groupItemId,
            language,
            user,
            source
          );

          await Promise.all(
            catList[0].groupItems.map(async (group) => {
              try {
                // Call createToken function to create new token from given data
                const token = createToken(organizationId, group.id, key);

                let response = await getAssets(
                  organizationId,
                  group.id,
                  token,
                  language,
                  assetProperty,
                  user,
                  source
                );
                // and response need to be added into final response array
                objectData.unshift({ category: group, assets: response });
              } catch (error) {
                console.log('error' + error);
              }
            })
          );
        }
        setAllCategoryItems(objectData);
      } catch (err) {
        console.log(err);
      }
    };

    if (organizationId && key && language && slickSettings) {
      //  && !allCategoryItems[id]
      // If there's no held data in context by component id, get data from api
      getDataFromAPI();
    } /* else if (allCategoryItems[id]?.length > 0) {
            // If there's data available by id in context, get data from context
            getDataFromContext();
        }*/

    return () => source.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCategories]);

  const renderCategories = () => {
    return allCategoryItems.map((group) => {
      // Choose child component for Title
      const TitleComponent = components[categoryTitleComponent];

      let categoryPushRoute = `/${routes.categories}/${group.category.id}`;

      return group.assets.length > 0 ? (
        <div
          className={classes.categoriesContainer}
          key={`${id} ${group.category.id}`}
        >
          <TitleComponent
            id={group.category.id}
            title={group.category.title}
            routes={routes}
            item={group.category}
            showViewAll={true}
            pushRoute={categoryPushRoute}
            extraClassname={props.extraClassname}
          />
          <Carousel {...slickSettings}>
            {group.assets.map((item, i) => {
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
            })}
          </Carousel>
        </div>
      ) : null;
    });
  };
  return allCategoryItems.length > 0 ? renderCategories() : null;
};

export default CategoriesWithTitles;
