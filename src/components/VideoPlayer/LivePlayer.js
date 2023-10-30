import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createAssetIdToken } from '../../scripts/utils';
import * as classes from './RadiantPlayer.module.css';

export default function LivePlayer(props) {
  console.log(props);
  const rmpPlayer = useRef();

  const history = useHistory();

  const [currentAssetId, setCurrentAssetId] = useState(null);

  useEffect(() => {
    let radiantscript, liveScript, eventScript;

    if (props.token && props.itemId) {
      if (currentAssetId && currentAssetId !== props.itemId) {
        window.location.reload();
      }
      // nno need vod.js for live event/video
      // need to load both live.js and event script for events which are  live
      const createScript = () => {
        radiantscript = document.createElement('script');
        liveScript = document.createElement('script');
        eventScript = document.createElement('script');

        radiantscript.src =
          'https://cdn.radiantmediatechs.com/rmp/6.4.11/js/rmp.min.js';
        radiantscript.async = true;

        liveScript.src = 'https://my.icareus.com/lib/js/v3/players/live.js';
        liveScript.async = true;
        eventScript.src = 'https://my.icareus.com/lib/js/v1/players/events.js';
        eventScript.async = true;
        document.body.appendChild(radiantscript);
        document.body.appendChild(liveScript);
        document.body.appendChild(eventScript);
      };
      createScript();
      setCurrentAssetId(props.itemId);

      window._icareus = {};

      window._icareus.companyId = '10154';

      window._icareus.groupId = '6877583';

      window._icareus.organizationId = '6877582';
      window._icareus.itemId = '130476416';

      window._icareus.host = 'https://suite.icareus.com';
      window._icareus.playerId = 'rmpPlayer';
      window._icareus.playerType = 'radiant';
      window._icareus.playerSetup = 'startOnDemandPlayer';
      window._icareus.playerAutoStart = true;
      window._icareus.userId = 0;
      window._icareus.licenseFileUrl =
        '/icareus-cache.secure2.footprint.net/suite/radiantplayerlicenses.json';
      window._icareus.streamRootKeysUrl =
        '/icareus-cache.secure2.footprint.net/suite/streamrootkeys.json';

      window._icareus.token = createAssetIdToken(
        props.organizationId,
        props.itemId,
        false,
        props.token
      );

      const backButtonHandler = () => {
        props.backRoute ? history.push(props.backRoute) : history.goBack();
      };

      const backCustomModule = {
        hint: 'Back', // Then name of the module - will show as hint within player UI
        svg: 'https://www.kirjastokino.fi/on-demand-player-portlet/images/button_back.svg', // Then SVG icon for the module
        svgHover:
          'https://www.kirjastokino.fi/on-demand-player-portlet/images/button_back.svg', // TODO: Image from /images, not web url
        // An optional second icon that can be displayed when the module is hovered
        callback: function () {
          // Our callback function
          backButtonHandler();
        },
      };

      const customModule = [backCustomModule];

      const ccFiles = [
        [
          'en',
          'English',
          'https://www.radiantmediaplayer.com/media/vtt/captions/cc.vtt',
        ],
        [
          'fr',
          'Français',
          'https://www.radiantmediaplayer.com/media/vtt/captions/cc-fr.vtt',
        ],
      ];
      let settings;

      function functionOne(_callback) {
        window._icareus.eventIdActual = '130476416';
        // assetID should always be 0 wheen it is live event
        window._icareus.assetId = 0;
        window.EVENT_ANALYTICS.init();
        _callback();
      }

      console.log(window);
      window.startOnDemandPlayer = function () {
        settings = {
          licenseKey: window._icareus.licenseFileUrl,
          src: window._icareus.sources,

          autoHeightMode: true,
          autoHeightModeRatio: 1.7777777778,
          skin: props.skin ? props.skin : 's1',

          skinBackgroundColor: props.skinBackgroundColor
            ? props.skinBackgroundColor
            : 'rgba(33, 33, 33, 0.85)',
          skinButtonColor: 'rgba(255, 255, 255, 1)',
          skinAccentColor: 'rgba(130, 177, 255, 1)',

          speed: props.speed ? true : false,
          automaticFullscreenOnLandscape: true,

          contentMetadata: {
            title: props.title ? props.title : null,
            description: props.description ? props.description : null,
            poster: [props.poster ? props.poster : window._icareus.thumbnail],
          },

          ccFiles,
          customModule: customModule,

          // Here we pass the ID of the player container so that the core library may automatically initialise player when it finishes loading
          asyncElementID: rmpPlayer.current.id,
        };

        console.log(window);
        window._icareus.playerObject.init(settings);

        functionOne(() => {});
      };
      return () => {
        document.body.removeChild(radiantscript);
        document.body.removeChild(liveScript);

        document.body.removeChild(eventScript);
      };
    }
  }, [props.itemId, props.token]);
  return (
    <>
      <div className={classes.RadiantPlayer}>
        <div ref={rmpPlayer} id='rmpPlayer'></div>
      </div>
    </>
  );
}
