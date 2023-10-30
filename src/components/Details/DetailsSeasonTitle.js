import { useEffect, useState } from 'react';
import { trancuate } from '../../scripts/utils';
import useWindowDimensions from '../WindowDimension';

export default function DetailsSeasonTitle(props) {
  const windowDimension = useWindowDimensions();
  const [text, setText] = useState(null);

  useEffect(() => {
    if (props.item) {
      let textVal =
        props.item.name || props.item.title || props.item.serie?.title;

      let result;
      console.log(textVal);

      if (windowDimension.width >= 550) {
        result = trancuate(textVal, props.size ? props.size : 120);
      } else {
        result = trancuate(textVal, props.mobileSize ? props.mobileSize : 60);
      }
      console.log(result);
      setText(result);
    }
  }, [props.item, windowDimension.width, props.mobileSize, props.size]);

  return text;
}
