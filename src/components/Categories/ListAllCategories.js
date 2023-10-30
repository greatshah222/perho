import React from 'react';
import { useEffect, useState } from 'react';
import { getSubCategories } from '../../scripts/dataHandlers';
import { createToken } from '../../scripts/utils';
import { useMyContext } from '../../contexts/StateHolder';
import RenderItem from '../ViewAssets/RenderItems/RenderItem';
import * as classes from './ListAllCategories.module.css';
import Carousel from 'react-multi-carousel';

export default function ListAllCategories({ settings, styles }) {
  const { organizationId, key, language, user } = useMyContext();
  const {
    groupItemId,
    slickSettings,
    routes,
    itemImageComponent,
    itemTitleComponent,
  } = settings;
  const [allSubCategories, setAllSubCategories] = useState(null);
  useEffect(() => {
    const getData = async () => {
      const token = createToken(organizationId, groupItemId, key);

      const res = await getSubCategories(
        organizationId,
        token,
        groupItemId,
        language,
        user
      );
      setAllSubCategories(res);
    };
    organizationId && key && getData();
  }, [groupItemId, key, language, user, organizationId, slickSettings]);

  return (
    <div className='categoriesContainer'>
      {allSubCategories && allSubCategories.length > 0 && (
        <div className={`${classes.ListAllCategories} font-500`}>
          <Carousel {...slickSettings} infinite={false}>
            {allSubCategories.map((item) => (
              <RenderItem
                key={`${item.id}`}
                item={item}
                routes={routes}
                itemImageComponent={itemImageComponent}
                itemTitleComponent={itemTitleComponent}
                // text Align in Middle

                textStyle={{ textAlign: 'center' }}
                renderCategory={true}
                styles={styles}
                showPlayIcon={true}
                hidePlayButton={true}
              />
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
}
