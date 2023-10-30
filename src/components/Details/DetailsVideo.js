import { useMyContext } from '../../contexts/StateHolder';
import DetailsFolderNames from './DetailsFolderNames';
import DetailsContentRatings from './DetailsContentRatings';
import DetailsInfoData from './DetailsInfoData';
import DetailsItemDescription from './DetailsItemDescription';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import {
  createAssetIdToken,
  createToken,
  removePunctuation,
} from '../../scripts/utils';
import { getAsset, getSubCategories } from '../../scripts/dataHandlers';
import DetailsAssetBanner from './DetailsAssetBanner';
import DetailsShare from './DetailsShare';
import * as classes from './DetailsVideo.module.css';
import Loader from 'react-loader-spinner';
import axios from 'axios';
import moment from 'moment';
import HelmetMetaData from '../ShareSocialMedia/HelmetMetaData';
const DetailsVideo = (props) => {
  // Bring stateholders from context
  const {
    chosenItem,
    setChosenItem,
    language,
    key,
    organizationId,
    user,
    loading,
    setLoading,
  } = useMyContext();

  const { asset } = useParams();

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    async function fetchAsset() {
      setChosenItem(null);
      console.log(1);
      setLoading(true);
      try {
        // Call createToken function to create new token from given data
        let token = createAssetIdToken(organizationId, asset, language, key);

        const assetResponse = await getAsset(
          organizationId,
          asset,
          token,
          language,
          undefined, // TODO: MOVE TO COMPONENT CONFIG
          user,
          source
        );
        console.log(`assetResponse`, assetResponse);

        setChosenItem(assetResponse);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }

    const fetchSerieCategoryAsset = async () => {
      setChosenItem(null);

      console.log(2);
      setLoading(true);

      try {
        let token3 = createToken(organizationId, asset, key);

        const response3 = await getSubCategories(
          organizationId,
          token3,
          asset,
          language,
          user,
          source
        );
        console.log(`response3`, response3);

        setChosenItem(response3[0]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    if (language) {
      props.isSerieCategory ? fetchSerieCategoryAsset() : fetchAsset();
    }

    return () => source.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, key, language, organizationId, props.isSerieCategory, user]);

  const renderDetails = () => {
    return (
      <div className='detailsContainer'>
        {/* <HelmetMetaData
          title={chosenItem?.title || chosenItem?.name}
          description={chosenItem?.ingress || chosenItem?.description}
          imageUrl={
            chosenItem?.bannerImageSmall ||
            chosenItem?.coverImageSmall ||
            props.chosenImage?.thumbnailSmall
          }
        /> */}
        {/* <HelmetMetaData
          image={
            // props.chosenItem?.bannerImageSmall ||
            // props.chosenItem?.coverImageSmall ||
            // props.chosenImage?.thumbnailSmall
            'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2787&q=80'
          }
          title={chosenItem?.title || chosenItem?.name}
          description={chosenItem?.ingress || chosenItem?.description}
        /> */}
        {!props.hideBanner && chosenItem?.bannerImageSmall ? (
          <DetailsAssetBanner routes={props.routes} hideCta={props.hideCta} />
        ) : null}

        <div className={classes.details_description_container}>
          <div className={classes.detailsDescriptionTitleContainer}>
            <div className={classes.details_description_title_left}>
              <div
                className={`${classes.details_description_title_name} font-600`}
              >
                {/* {`${removePunctuation( 
                  chosenItem?.name
                    ? chosenItem.name.toUpperCase()
                    : chosenItem.title.toUpperCase()
                )}`} */}
                {`${removePunctuation(
                  chosenItem?.name ? chosenItem.name : chosenItem.title
                )}`}
              </div>
              {/* {chosenItem.folders ? (
                <DetailsFolderNames routes={props.routes} />
              ) : null} */}
            </div>

            {chosenItem.contentRatings?.length > 0 && (
              <div className={classes.details_description_title_right}>
                <DetailsContentRatings />{' '}
              </div>
            )}
          </div>
          <div className='details-description-info-container'>
            <div className='detailsDescriptionContainer'>
              <DetailsItemDescription
                // extraClassName='font-200'
                showAll={true}
                desc={
                  chosenItem.ingress ||
                  chosenItem?.description ||
                  chosenItem?.serie?.description
                }
                size='1000000'
                mobileSize='1000000'
                sanitizeHTML={true}
              />
            </div>

            {!props.hideInfoData ? (
              <div className='detailsInfoContainer'>
                <DetailsInfoData item={chosenItem} />
              </div>
            ) : null}
          </div>
          {props.showPublishedDate && (
            <div className='asset-date font-000' style={{ paddingTop: '0px' }}>
              {moment(chosenItem.date).locale('fr').format('l')}
            </div>
          )}

          {props.hideShare ? (
            <div className='asset-date font-000' style={{ paddingTop: '0px' }}>
              {moment(chosenItem.date).locale('fr').format('l')}
            </div>
          ) : (
            <DetailsShare
              chosenItem={chosenItem}
              isSerieCategory={props.isSerieCategory}
            />
          )}
        </div>
      </div>
    );
  };

  // TODO: If /detailsVideo, take parameters and render loading while fetching data or something like that
  return chosenItem
    ? renderDetails()
    : !chosenItem && loading && (
        <div className='display-flex-center'>
          <Loader type='TailSpin' color='#161eaf' />
        </div>
      );
};

export default DetailsVideo;
