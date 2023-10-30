import React, { useEffect, useState } from 'react';
import * as classes from './ViewedSection.module.css';
import VideosImage from '../VideoComponent/VideosImage';
import VideosText from '../VideoComponent/VideosText';
import { useMyContext } from '../../contexts/StateHolder';
import { createToken } from '../../scripts/utils';
import { getSimilar, getSimilarBeta } from '../../scripts/dataHandlers';
import Loader from 'react-loader-spinner';
import { useHistory } from 'react-router-dom';

export default function ViewedSection(props) {
  const history = useHistory();

  const {
    allCategories,
    organizationId,
    key,
    language,
    setChosenItem,
    setChosenCategory,
  } = useMyContext();

  const [similarAssets, setSimilarAssets] = useState(null);
  const { routes } = props.settings;

  useEffect(() => {
    // gete one random values from allCatefories and limit 5

    const fetchSimilarItems = async () => {
      const groupItemId =
        allCategories.length > 0 &&
        allCategories[Math.floor(Math.random() * allCategories.length)].id;
      console.log(groupItemId, 'groupItemIs');
      // const token = createToken(organizationId, groupItemId, key);
      const token = createToken(organizationId, groupItemId, key);
      let res = await getSimilar(
        organizationId,
        groupItemId,
        token,
        language,
        20
      );
      // getting random 5 values from array
      console.log(res, 'res');
      res = res && res.sort(() => Math.random() - Math.random()).slice(0, 5);

      setSimilarAssets(res);
      console.log(`res fetch simlilar Items`, res);
    };

    if (organizationId && language && key) fetchSimilarItems();
  }, [allCategories, language, key, organizationId]);
  let category;

  const clickhandler = (item) => {
    // Set chosenItem
    setChosenItem(item);

    // When item is clicked, set chosen category
    setChosenCategory({ id: item.groupItemIds, title: item.groups });

    // Switch to details screen if movie, seriesDetails if serie

    item.isSerie
      ? history.push(`/${routes.serieRute}/${item.serie.id}`)
      : history.push({
          pathname: `/${routes.videoRoute}/organizationId/${organizationId}/assetId/${item.id}`,
        });
  };
  return (
    <div className={classes.ViewedSectionPrimary}>
      <div className={classes.ViewedSectionSecondary}>
        <h2>Something To Watch</h2>
        {category && (
          <div className={classes.categoryList}>
            <ul>
              {category.map((el) => (
                <li key={el}>{el}</li>
              ))}
            </ul>
          </div>
        )}

        {similarAssets && similarAssets.length > 0 ? (
          <>
            <div className={classes.ViewedSectionSecondary__3videos}>
              {similarAssets.slice(0, 3).map((el) => (
                <div className={classes.ViewedSectionSecondary__3videos__main}>
                  <VideosImage
                    imageNameWeb={el.thumbnailLarge}
                    playIconSize='2x'
                    showPlayIcon={true}
                    // showLikeIcon={true}
                    // likes='2.75'
                    duration={el.duration}
                    onClick={() => clickhandler(el)}
                  />
                  <VideosText
                    text={el.name}
                    hideActions={true}
                    onClick={() => clickhandler(el)}
                  />{' '}
                </div>
              ))}
            </div>
            <div className={classes.ViewedSectionSecondary__2videos}>
              {similarAssets.slice(3, 5).map((el) => (
                <div className={classes.ViewedSectionSecondary__2videos__main}>
                  <VideosImage
                    imageNameWeb={el.thumbnailLarge}
                    playIconSize='2x'
                    // showPlayIcon={true}
                    showLikeIcon={true}
                    // likes='2.75'
                    duration={el.duration}
                    onClick={() => clickhandler(el)}
                  />
                  <VideosText
                    text={el.name}
                    // views='2.38'
                    // comments='4'
                    hideActions={true}
                    onClick={() => clickhandler(el)}
                  />{' '}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className='display-flex-center'>
            {' '}
            <Loader type='TailSpin' color='#161eaf' />{' '}
          </div>
        )}
      </div>
    </div>
  );
}
