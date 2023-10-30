import { useMyContext } from '../../contexts/StateHolder';
import * as classes from './DetaillsFolderNames.module.css';
import { useHistory } from 'react-router-dom';

// Renders contentRatings of chosen item
const RenderFolderNames = (props) => {
  const history = useHistory();
  // Bring stateholders from context
  const { chosenItem } = useMyContext();

  const renderItem = props?.item || chosenItem;

  const clickHandler = (el) => {
    console.log(chosenItem.isSerie);
    if (chosenItem.isSerie) {
      return;
    }
    history.push(`/${props.routes.svodCategoriesRoute}/${el.id}`);
  };

  const renderFolderNames = () => {
    return renderItem.folders.map((cat, i) => {
      return (
        <div
          className={`${classes.folderName} font-200`}
          key={cat.id}
          onClick={() => clickHandler(cat)}
        >
          {cat.name}
          {/* {i < chosenItem.folders.length - 1 ? ',' : null} */}
        </div>
      );
    });
  };

  return (
    <div className='folderNamesList'>{chosenItem && renderFolderNames()}</div>
  );
};

export default RenderFolderNames;
