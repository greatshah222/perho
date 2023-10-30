import { useMyContext } from '../../contexts/StateHolder';
import { getImageByKey } from '../../scripts/getImageByKey';

/*
Renders: ContentRatings of chosen video/serie item.
Priorizes props, if used as child.
*/
const RenderContentRatings = (props) => {
  // Bring stateholders from context
  const { chosenItem } = useMyContext();

  const renderContentRatings = (item) => {
    if (item) {
      // Combine contentRatings and contentTypes -arrays into ratings array
      const ratings = item.contentRatings.concat(item.contentTypes);

      return ratings.map((ratingElement) => {
        return (
          <img
            className={'ratingElement'}
            key={ratingElement.id}
            src={getImageByKey(ratingElement.key)}
            title={ratingElement.name}
            alt={ratingElement.name}
          ></img>
        );
      });
    }
  };

  return (
    <div className='contentRatingsContainer' >
      {renderContentRatings(props.item ? props.item : chosenItem)}
    </div>
  );
};

export default RenderContentRatings;
