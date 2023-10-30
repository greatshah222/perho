import { useMyContext } from '../../../contexts/StateHolder';
import { useHistory } from 'react-router-dom';
import ItemTitle from './ItemTitle';
import ItemImage from './ItemImage';
import ItemImage1 from './ItemImage1/ItemImage1';
import ItemTitle1 from './ItemTitle1/ItemTitle1';
import Loader from 'react-loader-spinner';
import React from 'react';
//import ReactGA from 'react-ga';
//import { googleAnalytics } from '../configs/config_settings.json';

// List of usable item title and image components
const components = {
  ItemTitle,
  ItemImage,
  ItemImage1,
  ItemTitle1,
};

// Renders props item
const RenderItem = (props) => {
  const history = useHistory();
  //console.log(props, props.routes);
  // Bring stateholders from context
  const { setChosenCategory, setChosenItem } = useMyContext();

  const clickItem = (item) => {
    // Set chosenItem
    setChosenItem(item);

    // When item is clicked, set chosen category
    setChosenCategory({ id: item.groupItemIds, title: item.groups });

    /*
    if(googleAnalytics !== ""){
    // Report GA about clicked asset
    ReactGA.event({
      category: "Asset",
      action: `Clicked asset ${item.id} from ${window.location.pathname}`
    }
    */

    // Push user to route, which is defined in main component
    history.push(props.pushRoute);
  };

  // TODO: Pick image format based on config-file settings

  // Choose child component for image
  const ItemImageComponent = components[props.itemImageComponent];
  // Choose child component for itemTitle
  const ItemTitleComponent = components[props.itemTitleComponent];

  //console.log(props.item);
  return props.item.name !== 'placeholderItem' &&
    props.item.id !== '123456789087654321' ? (
    <div
      className={'categoryItem'}
      key={props.item.id}
      onClick={() => clickItem(props.item)}
    >
      <ItemImageComponent
        item={props.item}
        imageType={props.imageType}
        showPlayIcon={props.showPlayIcon}
        hidePlayButton={props.hidePlayButton}
        playIconSize='2x'
        // aspectRatio
        maintainImageAspectRatio={props.maintainImageAspectRatio}
      />

      <ItemTitleComponent
        item={props.item}
        showCategoryName={props.showCategoryName}
        showReleaseYear={props.showReleaseYear}
        showDuration={props.showDuration}
        showStatus={props.showStatus}
        textStyle={props.textStyle}
        cutText={props.cutText}
      />
    </div>
  ) : (
    <div className={'categoryItemPlaceholder'} key={props.item.id}>
      <Loader
        type='TailSpin'
        color='#dfdfdf'
        height={50}
        width={50}
        timeout={3000} //3 secs
      />
    </div>
  );
};

export default RenderItem;
