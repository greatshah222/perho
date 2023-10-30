import React, { useEffect, useState } from 'react';

import { createToken } from '../../scripts/utils';
import { useMyContext } from '../../contexts/StateHolder';
import { getAssets } from '../../scripts/dataHandlers';
import { useHistory } from 'react-router-dom';

import EditorChoiceItem from './EditorChoiceItem';

import axios from 'axios';

export default function EditorChoice(props) {
  const { key, organizationId, language, setChosenCategory, setChosenItem, user } = useMyContext();

  const [EditorChoiceAssets, setEditorChoiceAssets] = useState(null);

  const history = useHistory();


  const { routes, groupItemId, assetProperty, showEditorChoiceIcon, pushRoute } = props.settings;

  useEffect(() => {

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const runFunction = async () => {
      // organizationId, groupItemId, token, lang
      const token = createToken(organizationId, groupItemId, key);
      const res = await getAssets(organizationId, groupItemId, token, language, assetProperty, user, source);

      // take only 4
      console.log(res, 'res eeditor');
      setEditorChoiceAssets(res.slice(0, 4));
    };

    if (key && organizationId && language) {
      runFunction();
    }

    return () => source.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId, key, language, groupItemId]);

  const clickhandler = (item) => {
    // Set chosenItem
    setChosenItem(item);

    // When item is clicked, set chosen category
    setChosenCategory({ id: item.groupItemIds, title: item.groups });

    console.log(pushRoute);
    // Switch to details screen if movie, seriesDetails if serie. Use predefined pushRoute if available
    if (pushRoute && pushRoute !== "") {
      history.push(`/${pushRoute}/${organizationId}/${item.id}`)
    } else {
      item.isSerie
        ? history.push(`/${routes.serie}/${item.serie.id}`)
        : history.push(
          `/${routes.videoRoute}/organizationId/${organizationId}/assetId/${item.id}`
        );
    }
  };

  return (
    EditorChoiceAssets && (
      <EditorChoiceItem
        assets={EditorChoiceAssets}
        clickhandler={clickhandler}
        showEditorChoiceIcon={showEditorChoiceIcon}
      />
    )
  );
}
