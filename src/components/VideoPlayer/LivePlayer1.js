import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { createAssetIdToken } from '../../scripts/utils';
import * as classes from './RadiantPlayer.module.css';
import { useTranslation } from 'react-i18next';
import { getImageByKey } from '../../scripts/getImageByKey';

export default function LivePlayer1(props) {
  console.log(props);
  const rmpPlayer = useRef();

  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    let radiantscript, liveScript, advertjs;

    if (props.channelServiceId) {
      // no need vod.js for live event/video
      // need to load both live.js and event script for events which are  live
      const createScript = () => {
        radiantscript = document.createElement('script');
        liveScript = document.createElement('script');
        advertjs = document.createElement('script');

        radiantscript.src =
          'https://cdn.radiantmediatechs.com/rmp/6.4.11/js/rmp.min.js';
        radiantscript.async = true;

        // liveScript.src =
        //   'https://staging1.icareus.com/lib/js/players/v3/players/live.js';
        advertjs.async = true;
        advertjs.src =
          'https://staging1.icareus.com/lib/js/players/v3/players/adverts.js';

        liveScript.src =
          'https://icareus-suite.secure2.footprint.net/lib/js/v3/players/live.js';
        liveScript.async = true;

        document.body.appendChild(radiantscript);
        document.body.appendChild(liveScript);
        document.body.appendChild(advertjs);
      };
      createScript();

      window._icareus = {};

      window._icareus.companyId = props.companyId;

      window._icareus.groupId = props.groupId;

      window._icareus.organizationId = props.organizationId;
      // itemID and serviceId is same and it must be passed
      window._icareus.itemId = props.channelServiceId;
      window._icareus.serviceId = props.channelServiceId;

      window._icareus.host = 'https://suite.icareus.com';
      window._icareus.playerId = 'rmpLivePlayer';
      window._icareus.playerType = 'radiant';
      window._icareus.playerSetup = 'startOnDemandPlayer';
      window._icareus.playerAutoStart = true;
      window._icareus.userId = props.userId;
      window._icareus.licenseFileUrl =
        '//icareus-cache.secure2.footprint.net/suite/radiantplayerlicenses.json';
      window._icareus.streamRootKeysUrl =
        '//icareus-cache.secure2.footprint.net/suite/streamrootkeys.json';
      // window._icareus.useAdvertsLibrary = true;

      window._icareus.token = createAssetIdToken(
        props.organizationId,
        props.channelServiceId,
        false,
        props.token
      );

      const backButtonHandler = () => {
        props.backRoute ? history.push(props.backRoute) : history.goBack();
      };

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

      // const customModule = [backCustomModule];
      const customModule = [];

      let settings;

      window.startOnDemandPlayer = function () {
        settings = {
          licenseKey: window.location.hostname.includes('icareus.com')
            ? `Kl8lc3k9b3Y4MDJ5ZWk/cm9tNWRhc2lzMzBkYjBBJV8q`
            : props.license,
          src: window._icareus.sources,

          autoHeightMode: true,
          autoHeightModeRatio: 1.7777777778,
          autoplay: true,
          skin: props.skin ? props.skin : 's1',

          skinBackgroundColor: props.skinBackgroundColor
            ? props.skinBackgroundColor
            : 'rgba(33, 33, 33, 0.85)',
          skinButtonColor: 'rgba(255, 255, 255, 1)',
          skinAccentColor: 'rgba(130, 177, 255, 1)',

          speed: props.speed ? true : false,
          automaticFullscreenOnLandscape: true,
          adTagUrl: window._icareus.videoVastURL,
          ads: true,

          contentMetadata: {
            title: props.title ? props.title : null,
            description: props.description ? props.description : null,
            // poster: [props.poster ? props.poster : window._icareus.thumbnail],
          },

          customModule: customModule,

          asyncElementID: rmpPlayer.current.id,
        };

        window._icareus.playerObject.init({ ...settings });
      };

      return () => {
        document.body.removeChild(radiantscript);
        document.body.removeChild(liveScript);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.channelServiceId]);

  return (
    <>
      <div className={classes.RadiantPlayer}>
        <div ref={rmpPlayer} id='rmpLivePlayer'></div>
      </div>
    </>
  );
}
