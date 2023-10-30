import React from 'react';
import * as classes from './EditorChoice.module.css';
import * as classesHeroSecondary from './../Hero/HeroBanner.module.css';
import VideoHero from '../VideoComponent/VideoHero';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loader from 'react-loader-spinner';
import { useTranslation } from 'react-i18next';

export default function EditorChoiceItem(props) {
  const { t } = useTranslation();

  return (
    <div className={classes.EditorChoice}>
      <div className={classes.EditorChoicePrimary}>
        <div className={classes.starIcon}>
          <FontAwesomeIcon icon='star' size='2x' />
          <FontAwesomeIcon icon='star' size='3x' />
          <FontAwesomeIcon icon='star' size='2x' />
        </div>
        <h2>{t('editorsChoice.videosTitle')}</h2>

        <div className={classesHeroSecondary.container_multipleItem}>
          {props.assets && props.assets.length > 0 ? (
            props.assets.map((el, i) => (
              <div key={i}>
                <VideoHero
                  imageNameWeb={el.thumbnailLarge}
                  title={el.name}
                  categoryName={el.groups.split('|')[0]}
                  showEditorChoiceIcon={props.showEditorChoiceIcon}
                  onClick={() => props.clickhandler(el)}
                />
              </div>
            ))
          ) : (
            <div className='display-flex-center'>
              {' '}
              <Loader type='TailSpin' color='#161eaf' />{' '}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
