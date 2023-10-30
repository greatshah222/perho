import { useMyContext } from '../../../contexts/StateHolder';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAssets } from '../../../scripts/dataHandlers';
import { createToken } from '../../../scripts/utils';

import * as classesRender from './ChosenCategoryGrid1.module.css';
import RenderItem from '../RenderItems/RenderItem';

const ChosenCatgoryGrid1 = (props) => {
  const { chosenCategory, allCategories, key, language, organizationId } =
    useMyContext();
  const { routes, itemImageComponent, itemTitleComponent } = props.settings;

  const [items, setItems] = useState([]);

  const [categoryName, setCategoryName] = useState([]);

  const { asset } = useParams();

  useEffect(() => {
    async function getData() {
      try {
        const token = createToken(organizationId, asset, key);

        const itemList = await getAssets(
          organizationId,
          asset,
          token,
          language
        );

        setCategoryName(
          itemList[0].folders.find(
            (category) => Number(category.id) === Number(asset)
          ).name
        );

        setItems(itemList);
      } catch (err) {
        console.log(err);
      }
    }
    if (allCategories.length > 0) {
      getData();
    }
  }, [allCategories, language, asset, key, organizationId]);

  const renderChosenCategoryGrid = () => {
    return items.map((item) => {
      return (
        <RenderItem
          key={item}
          item={item}
          routes={routes}
          itemImageComponent={itemImageComponent}
          itemTitleComponent={itemTitleComponent}
        />
      );
    });
  };

  return organizationId ? (
    <>
      <div className={classesRender.chosenCategoryGrid}>
        <div
          className='categoryTitleContainer'
          style={props.styles?.categoryTitleContainer}
        >
          <div
            className={'categoryTitleNoHover'}
            style={props.styles?.categoryTitleNoHover}
          >
            {chosenCategory.title ? chosenCategory.title : categoryName}
          </div>
        </div>
        <div
          className={classesRender.ViewedSectionSecondary__3videos}
          style={props.styles?.categoryGridContainer}
        >
          {items ? (
            renderChosenCategoryGrid()
          ) : (
            <div className='display-flex-center'>
              {' '}
              {/* <Loader type='TailSpin' color='#ecc200' /> */}
            </div>
          )}
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default ChosenCatgoryGrid1;
