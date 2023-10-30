import { useHistory } from 'react-router-dom';
import * as classes from './CategoryTitle2.module.css';
import { useMyContext } from '../../../../contexts/StateHolder';
import Header from '../../../../Shared/Header/Header';
import ItemLink from '../../../../Shared/ItemLink/ItemLink';

const CategoryTitle2 = (props) => {
  const history = useHistory();
  const { setChosenCategory, organizationId, setChosenItem } = useMyContext();

  const clickCategory = async (categoryObj) => {
    if (props?.routes?.viewAllRoute && props?.routes?.viewAllRoute !== '') {
      history.push(`/${props.routes.viewAllRoute}`);
    } else if (props.isSerie) {
      setChosenCategory(categoryObj);
      setChosenItem(null);
      return history.push(
        `/${props.routes.categories}/${organizationId}/${categoryObj.id}/${categoryObj.id}/${props.item.groupItems[0].id}`
      );
    } else {
      setChosenCategory(categoryObj);
      history.push(`/${props.routes.categories}/${categoryObj.id}`);
    }
  };

  return (
    <div className={classes.CategoryItem_main}>
      <div className={`${classes.CategoryItem_main_info} font-500 `}>
        <Header
          extraClassname={props.extraClassname}
          title={props.title}
          showTitle={props.showTitle}
        />

        {props?.item?.length > 0 && (
          <ItemLink
            clickCategory={clickCategory}
            id={props.id}
            title={props.title}
          />
        )}

        {/* // for Serie Asset */}
        {props.showViewAll && (
          <ItemLink
            clickCategory={clickCategory}
            id={props.id}
            title={props.title}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryTitle2;
