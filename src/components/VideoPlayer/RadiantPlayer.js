import React, { useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { createAssetIdToken, createToken } from '../../scripts/utils';
import { getImageByKey } from '../../scripts/getImageByKey';
import { useTranslation } from 'react-i18next';
import { useMyContext } from '../../contexts/StateHolder';
import { getAsset } from '../../scripts/dataHandlers';
import axios from 'axios';

//const { REACT_APP_RADIANT_LICENSE } = process.env;

export default function RadiantPlayer(props) {
  const { chosenItem, language, key, setChosenItem, assetProperty, user } =
    useMyContext();
  console.log(props);
  const rmpPlayer = useRef();

  const history = useHistory();

  // Setup translate function
  const { t } = useTranslation();
  console.log(`chosenItem`, chosenItem, props.isSerie);

  const { asset } = useParams();

  useEffect(() => {
    let radiantscript, vodjs, advertjs;
    if (chosenItem && props.isSerie && !chosenItem.serie) {
      // finding ffolder name and id of series asset
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      const fetchChosenItem = async () => {
        const token5 = createAssetIdToken(
          props.organizationId,
          asset,
          language,
          key
        );

        const res = await getAsset(
          props.organizationId,
          asset,
          token5,
          language,
          assetProperty,
          user,
          source
        );
        console.log(res, 'res assets');
        setChosenItem(res);
      };
      fetchChosenItem();
    }

    if (props.secretKey && props.itemId && chosenItem) {
      const createScript = () => {
        radiantscript = document.createElement('script');
        vodjs = document.createElement('script');
        advertjs = document.createElement('script');

        radiantscript.src =
          'https://cdn.radiantmediatechs.com/rmp/6.4.11/js/rmp.min.js';
        radiantscript.async = true;

        // vodjs.src = 'https://my.icareus.com/lib/js/v4/players/vod.js';

        vodjs.async = true;
        vodjs.src =
          'https://staging1.icareus.com/lib/js/players/v4/players/vod1.js';

        advertjs.async = true;
        advertjs.src =
          'https://staging1.icareus.com/lib/js/players/v3/players/adverts.js';

        document.body.appendChild(radiantscript);
        document.body.appendChild(vodjs);
        document.body.appendChild(advertjs);
      };
      createScript();

      window._icareus = {};

      window._icareus.companyId = props.companyId;

      window._icareus.groupId = props.groupId;

      window._icareus.organizationId = props.organizationId;

      window._icareus.itemId = props.itemId;

      window._icareus.host = 'https://suite.icareus.com';
      window._icareus.playerId = 'rmpPlayer';
      window._icareus.playerType = 'radiant';
      window._icareus.playerSetup = 'vodJSCallback';
      window._icareus.playerAutoStart = true;
      window._icareus.userId = props.userId;

      // VOD ADVERT
      window._icareus.campaignId = props.campaignIDD;
      // window._icareus.campaignId = 133485137;
      window._icareus.useAdvertsLibrary = props.campaignIDD ? true : false;
      window._icareus.advertVOD = props.campaignIDD ? true : false;
      // default 30
      window._icareus.applicationTypeId = 30;
      window._icareus.applicationId = 133485121;

      window._icareus.token = createAssetIdToken(
        props.organizationId,
        props.itemId,
        false,
        props.secretKey
      );
      console.log(window);

      /* 
      
      for google analytics
      this gaLabel is for sending analytics for given

            Events to be sent for the Asset (more details: https://www.radiantmediaplayer.com/docs/latest/google-analytics.html#ga-events):
        eventCategory: 'Video',
      hitType: 'event'
      gaLabel: "Asset_Name [Asset_ID]"
      Event Actions
      Impression, once player is ready
      Play, once playerstart
      Seek, seeking
      IF the following are know on the page:
      Series Events to be sent (custom event)
        eventCategory: 'Series',
      hitType: 'event'
      gaLabel: "Series_Name [series_ID]"
      Event Actions
      Impression, once player is ready
      Play, once playerstart
      e.g. ga('send', 'event', 'Series', 'play', 'Lunch Break Challenge[133944134]');
      
      
      */

      window._icareus.gaLabel = ` ${
        chosenItem?.name
          ? chosenItem.name.toUpperCase()
          : chosenItem.title.toUpperCase()
      }[${props.itemId}]`;

      window._icareus.gaCategory = props.isSerie ? 'Series' : 'Videos';
      window._icareus.gatrackingId = 'UA-82995370-2';
      // window._icareus.gatrackingId = 'G-XS276N8EC7';
      window._icareus.isSerie = props.isSerie ? props.isSerie : false;
      console.log(
        `object series`,
        `${chosenItem.serie?.title}[${chosenItem.serie?.id}]`
      );

      window._icareus.gaFolderLabel = props.isSerie
        ? `${chosenItem.serie?.title}[${chosenItem.serie?.id}]`
        : chosenItem.folders && chosenItem.folders.length > 0
        ? `${chosenItem.folders[0].name}/${chosenItem.folders.id}`
        : 'Demo Title For Videos';

      window._icareus.gaFolderCategory = 'Folder';

      const backButtonHandler = () => {
        if (props.backRoute === undefined) {
          history.goBack();
        } else if (props.backRoute === 'hidden') {
          props.setShowPlayer('wantedHidden');
        } else {
          history.push(props.backRoute);
        }
        //props.backRoute ? history.push(props.backRoute) :
      };

      // for the below google analytics we need categoryId and categoryName of series/videos assets

      /* 


Folder/Categories Events to be sent (custom event)
  eventCategory: 'Folder',
hitType: 'event'
gaLabel: "Folder_Name [Folder_ID]"
Event Actions
Impression, once player is ready
Play, once playerstart
e.g. ga('send', 'event', 'Folder', 'play', 'Scifi[234245425]'); */

      // Then we define a custom module - in this case a 10s rewind module
      const backCustomModule = {
        hint: t('videoPlayer.close'), // Then name of the module - will show as hint within player UI
        svg: getImageByKey('symbolX'), // Then SVG icon for the module
        svgHover: getImageByKey('symbolX'), // TODO: Image from /images, not web url
        // An optional second icon that can be displayed when the module is hovered
        callback: function () {
          // Our callback function
          backButtonHandler();
        },
      };

      // captions
      // Your WebVTT closed captions
      // const ccFiles = [
      //   [
      //     'en',
      //     'English',
      //     'https://www.radiantmediaplayer.com/media/vtt/captions/cc.vtt',
      //   ],
      //   [
      //     'fr',
      //     'Français',
      //     'https://www.radiantmediaplayer.com/media/vtt/captions/cc-fr.vtt',
      //   ],
      // ];
      let settings;
      console.log(window.location.hostname);

      // function functionOne(_callback) {
      //   window._icareus.eventIdActual = 1408801;
      //   window._icareus.assetId = 1407203;
      //   window.EVENT_ANALYTICS.init();

      //   _callback();
      // }

      window.vodJSCallback = function () {
        // Then we set our player settings
        settings = {
          licenseKey: window.location.hostname.includes('icareus.com')
            ? `Kl8lc3k9b3Y4MDJ5ZWk/cm9tNWRhc2lzMzBkYjBBJV8q`
            : props.license,
          src: window._icareus.sources,

          // height and width selected based on 16/9 aspect ration
          autoHeightMode: true,
          autoHeightModeRatio: 1.7777777778,
          // Let us select a skin (options aree s1,s2,s3 and s4)
          skin: props.skin ? props.skin : 's1',

          // skinBackgroundColor should be rgba
          skinBackgroundColor: props.skinBackgroundColor
            ? props.skinBackgroundColor
            : 'rgba(33, 33, 33, 0.85)',
          skinButtonColor: 'rgba(255, 255, 255, 1)',
          skinAccentColor: 'rgba(130, 177, 255, 1)',

          // this is for playback speed
          speed: props.speed ? true : false,
          automaticFullscreenOnLandscape: true,
          ads: props.campaignIDD ? true : false,
          adTagUrl: window._icareus.videoVastURL,
          gaTrackingId: window._icareus.playerObject.gaTrackingId,
          // 133485121 is playerID which is hardcoded for now
          // adTagUrl: `https://suite.icareus.com/api/vast?organizationId=${props.organizationId}&type=vod&applicationId=133485121&campaignIds=133485137&applicationTypeId=30&assetId=${props.itemId}`,
          // Let us add a poster frame to our player

          contentMetadata: {
            title: props.title ? props.title : null,
            description: props.description ? props.description : null,
            poster: [props.poster ? props.poster : window._icareus.thumbnail],
          },

          ccFiles: null,
          ...(props.backButton
            ? { customModule: [{ ...backCustomModule }] }
            : {}),

          // Here we pass the ID of the player container so that the core library may automatically initialise player when it finishes loading
          asyncElementID: rmpPlayer.current.id,
        };
        console.log(settings);
        console.log(window._icareus);

        window._icareus.playerObject.init({ ...settings });
        console.log(window._icareus);

        // functionOne(() => {});
      };
      console.log(window);
      console.log(window._icareus);

      return () => {
        document.body.removeChild(radiantscript);
        document.body.removeChild(vodjs);
        document.body.removeChild(advertjs);

        // document.body.removeChild(eventScript);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // you may set the width even in the parent component to make these values as variables
    <div ref={rmpPlayer} id='rmpPlayer'></div>
  );
}
