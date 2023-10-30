import { useMyContext } from '../../contexts/StateHolder';
import * as classes from './RenderItemDescription.module.css';
import { useState } from 'react';
import useWindowDimensions from '../WindowDimension';
import { trancuateDesc } from '../../scripts/utils';
import { useEffect } from 'react';

const RenderItemDescription = (props) => {
  const { chosenItem } = useMyContext();
  const [text, setText] = useState(null);

  const windowDimension = useWindowDimensions();

  useEffect(() => {
    if (props.desc || chosenItem?.itemDescription) {
      let textDescResult = props.desc || chosenItem?.itemDescription;

      if (windowDimension.width >= 550) {
        if (props.sanitizeHTML) {
          textDescResult = textDescResult.replace(/<\/?[^>]+(>|$)/g, '');
        }
        textDescResult = trancuateDesc(textDescResult, props.size || 90);
      } else {
        if (props.sanitizeHTML) {
          textDescResult = textDescResult.replace(/<\/?[^>]+(>|$)/g, '');
        }
        textDescResult = trancuateDesc(textDescResult, props.mobileSize || 70);
      }
      setText(textDescResult);
    }
  }, [
    chosenItem,
    props.desc,
    props.size,
    windowDimension.width,
    props.mobileSize,
    props.sanitizeHTML,
  ]);

  const renderItemDescription = () => {
    return (
      <div
        className={`${classes.itemDescription} thin-book font-300 ${props.extraClassName}`}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  };

  return renderItemDescription(
    props.desc ? props.desc : chosenItem.description
  );
};

export default RenderItemDescription;
