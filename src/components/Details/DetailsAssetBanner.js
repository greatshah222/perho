import { FaPlay } from 'react-icons/fa';
import { useMyContext } from '../../contexts/StateHolder';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getImageByKey } from '../../scripts/getImageByKey';
import { useState, useEffect } from 'react';

const DetailsAssetBanner = (props) => {
  // Bring stateholders from context
  const { chosenItem, organizationId } = useMyContext();

  const history = useHistory();

  const { t } = useTranslation();

  const click = () => {
    history.push(
      `/${props.routes.playVideo}/${organizationId}/${chosenItem.id}`
    );
  };

  const renderAction = () => {
    return (
      <button className='detailsPlayContainer' onClick={() => click()}>
        <FaPlay className='svg-play' fill='white' />
        {t('detailsBanner.action')}
      </button>
    );
  };
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    setBackgroundImage(
      chosenItem.isSerie
        ? chosenItem?.serie?.bannerImageSmall || chosenItem.bannerImageSmall
        : chosenItem.bannerImageSmall
    );
  }, [chosenItem]);

  const renderDetailsAssetBanner = () => {
    return (
      <div className='detailsUpper'>
        <div
          className='detailsUpperBackground'
          style={{
            backgroundImage: backgroundImage
              ? `url(${backgroundImage})`
              : `url(${getImageByKey('channelBannerDemo')})`,
          }}
        ></div>
        <div className='detailsUpperSmall'>
          <div className='detailsUpperCoverContainer'></div>
          {!props.hideCta && renderAction()}
        </div>
      </div>
    );
  };

  return chosenItem ? renderDetailsAssetBanner() : null;
};

export default DetailsAssetBanner;
