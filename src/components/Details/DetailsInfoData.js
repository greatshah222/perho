import { useMyContext } from '../../contexts/StateHolder';
import { convertDuration } from '../../scripts/utils';
import { useTranslation } from 'react-i18next';

// Renders contentRatings of chosen item
// Priorizes props, if used as child.
const RenderInfoData = (props) => {
  // Bring stateholders from context
  const { chosenItem } = useMyContext();

  // Setup translation function
  const { t } = useTranslation();

  const renderInfoData = (data) => {
    return (
      <div className='infoDataContainer font-400'>
        <div className={'dataTitle'}>
          {t('detailsInfo.director')}
        </div>

        <div
          className={'dataValue font-300'}
          font-400
        >
          {data.director ? data.director : '-'}
        </div>

        <div className={'dataTitle'}>
          {t('detailsInfo.actors')}
        </div>

        <div className={'dataValue font-300'}>
          {data.actors ? data.actors.replace(/,/g, ', ') : '-'}
        </div>

        <div className={'dataTitle'}>
          {t('detailsInfo.releaseYear')}
        </div>

        <div className={'dataValue font-300'}>
          {data.releaseYear ? data.releaseYear : '-'}
        </div>

        {data.duration ? (
          <div className={'dataTitle'}>
            {t('detailsInfo.duration')}
          </div>
        ) : null}

        {data.duration ? (
          <div className={'dataValue font-300'}>
            {convertDuration(data.duration)}
          </div>
        ) : null}

        <div className={'dataTitle'}>
          {t('detailsInfo.languages')}
        </div>

        <div className={'dataValue font-300'}>
          -
        </div>

        <div className={'dataTitle'}>
          {t('detailsInfo.subtitles')}
        </div>

        <div className={'dataValue font-300'}>
          -
        </div>
      </div>
    );
  };

  return renderInfoData(props.item ? props.item : chosenItem);
};

export default RenderInfoData;
