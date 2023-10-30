import { useMyContext } from '../../contexts/StateHolder';
import { useEffect, useState } from 'react';
import {
  createToken,
  createAssetIdToken,
  removePunctuation,
} from '../../scripts/utils';
import { getAsset, getSubCategories } from '../../scripts/dataHandlers';
import DetailsFolderNames from './DetailsFolderNames';
import DetailsItemDescription from './DetailsItemDescription';
import DetailsSeasonsAndEpisodes from './DetailsSeasonsAndEpisodes';
import DetailsAssetBanner from './DetailsAssetBanner';
import { useParams } from 'react-router-dom';

const DetailsSerie = (props) => {
  const { assetProperty } = props?.settings || '';

  // Bring stateholders from context
  const { chosenItem, setChosenItem, language, organizationId, key, user } =
    useMyContext();

  const [details, setDetails] = useState({});

  const { asset } = useParams();
  console.log(asset, language, chosenItem);

  useEffect(() => {
    async function fetchAsset() {
      try {
        /*******  HORRIBLE TEMPORARY BUBBLEGUM! TODO: FIX ROUTING SO IT TAKES SERIEID FROM URL  ********/

        let item;
        // Call createToken function to create new token from given data
        let token = createToken(organizationId, asset, key);

        const response = await getSubCategories(
          organizationId,
          token,
          asset,
          language,
          user
        );
        console.log(response);

        if (response.length === 0) {
          // **** Because subcategories didnt return anything with assetId, get asset **** //
          let token2 = createAssetIdToken(organizationId, asset, language, key);

          const response2 = await getAsset(
            organizationId,
            asset,
            token2,
            language
          );

          // **** Because getAsset didnt return full serie data (missing folders and such), get subcategories again now with serieId **** //
          let token3 = createToken(organizationId, response2.serie.id, key);
          const response3 = await getSubCategories(
            organizationId,
            token3,
            response2.serie.id,
            language,
            user
          );

          item = response3[0];
        } else {
          item = response[0];
        }
        console.log(item);
        setChosenItem(item);
      } catch (err) {
        console.log(err);
      }
    }

    if (language) {
      // Get serie asset AND after that episodes for it
      fetchAsset();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, organizationId, key, assetProperty, user]);
  console.log(chosenItem);

  if (chosenItem?.title) {
    let f = removePunctuation(...chosenItem.title);
    console.log(f, 'lkk');
  }

  const renderSerieDetails = () => {
    return (
      <div className='detailsContainer'>
        {!props.hideBanner && chosenItem && (
          <DetailsAssetBanner playVideoRoute={false} />
        )}

        <div className='details-description-container'>
          <div className='detailsDescriptionTitleContainer'>
            <div className='details-description-title-left'>
              <div className='details-description-title-name'>
                {/* // since we are changint this to uppercase , we need to remove punctuatuion */}
                {console.log('object')}

                {`${removePunctuation(chosenItem.title)}`}
              </div>
              {details?.folders?.length > 0 ? (
                <div className='folderName'>
                  <DetailsFolderNames item={details} />
                </div>
              ) : null}
            </div>
          </div>
          <div className='details-description-info-container'>
            <DetailsItemDescription desc={chosenItem.description} />
          </div>
        </div>
        <DetailsSeasonsAndEpisodes
          item={chosenItem}
          setDetails={setDetails}
          playVideoRoute={props.playVideoRoute}
        />
      </div>
    );
  };

  return chosenItem &&
    Object.keys(chosenItem).length > 0 &&
    chosenItem?.groupItems
    ? renderSerieDetails()
    : null;
};

export default DetailsSerie;
