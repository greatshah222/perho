import React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMyContext } from '../../contexts/StateHolder';
import { getAsset } from '../../scripts/dataHandlers';
import { createAssetIdToken } from '../../scripts/utils';

export default function DetailsSerieContainer(props) {
  const { orgId, asset } = useParams();

  const { setChosenItem, language, key } = useMyContext();

  useEffect(() => {
    const getData = async () => {
      let token2 = createAssetIdToken(orgId, asset, language, key);

      const response2 = await getAsset(orgId, asset, token2, language);

      setChosenItem(response2);
    };

    language && language && key && !props.isSerie && getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, asset]);

  return <>{props.children}</>;
}
