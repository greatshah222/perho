import { useMyContext } from '../../contexts/StateHolder';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import RadiantPlayer from './RadiantPlayer.js';
import { organization } from '../../configs/config_settings.json';
import { useTranslation } from 'react-i18next';
import { getPlayerConfig } from '../../scripts/dataHandlers';
//import LivePlayer from './LivePlayer';
//import LivePlayer1 from './LivePlayer1';

const AssetVideoPlayer = (props) => {
  // Bring stateholders from context
  const { user, chosenItem, loading, setLoading } = useMyContext();

  // Get asseId from URL parameters
  const { asset, orgId } = useParams();

  const { t } = useTranslation();
  // Stateholders for different id:s

  const [assetId, setAssetId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [userId, setUserId] = useState(0);
  const [showPlayer, setShowPlayer] = useState('hidden');
  const [campaignID, setCampaignID] = useState(null);

  useEffect(() => {
    if (organization.organizationId === orgId) {
      // Set organizationId
      setOrganizationId(organization.organizationId);
      // Set companyId
      setCompanyId(organization.companyId);
      // Set groupId
      setGroupId(organization.groupId);
      // Set secretKey
      setSecretKey(organization.key);

      // check for adevertisement
      const checkAdvertisementPlayerConfig = async () => {
        const res = await getPlayerConfig();
        console.log(res);
        const campaignId = res.data.items.find(
          (el) => el.title === 'player-campaigns-list'
        ).value;
        console.log(campaignId);

        if (campaignId && campaignId * 1 > 0) setCampaignID(campaignId);
        console.log(campaignId);

        setLoading(false);
      };
      checkAdvertisementPlayerConfig();
    } else {
      // TODO: GET SUBORGANIZATION DATA FROM SOMEWHERE
      const wantedSubOrg = {
        organizationId: '1404509',
        companyId: 10154,
        groupId: 1404510,
        key: 'K46JN3QxfV',
      };

      // Set organizationId
      setOrganizationId(wantedSubOrg.organizationId);
      // Set companyId
      setCompanyId(wantedSubOrg.companyId);
      // Set groupId
      setGroupId(wantedSubOrg.groupId);
      // Set secretKey
      setSecretKey(wantedSubOrg.key);
    }

    setUserId(user?.userId || 0);
    // Set assetId from URL parameters
    setAssetId(asset); // asset '1407203'

    /* 
    If showPlayer is hidden (first time) or wantedHidden (user closed the player),
    turn it to visible as first/new video has been chosen.

    If player is already visible and new one is chosen, make player hidden
    (it will be reactivated in next useEffect)
    */
    if (showPlayer === 'hidden' || showPlayer === 'wantedHidden') {
      setShowPlayer('visible');
    } else {
      setShowPlayer('hidden');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, orgId, user]);

  useEffect(() => {
    // If showPlayer is hidden, turn it visible. If showPlayer is wantedHidden, keep it hidden.
    if (showPlayer === 'hidden') {
      setShowPlayer('visible');
    } else if (showPlayer === 'wantedHidden') {
      // Do nothing as setting is correct
    }
  }, [showPlayer]);

  console.log(`campaignID`, campaignID);
  console.log(`chosenItem`, chosenItem);

  if (
    user &&
    assetId !== '' &&
    organizationId !== '' &&
    showPlayer === 'visible' &&
    !loading &&
    chosenItem
  ) {
    return (
      <div className='maxContainerPrimary'>
        <div className='maxContainer'>
          <RadiantPlayer
            companyId={companyId}
            groupId={groupId} // Group of organization
            organizationId={organizationId} // Id of organization
            itemId={assetId} // AssetId to play
            playerAutoStart={props.playerAutoStart}
            userId={userId} // Id of user, if undefined in token, use zero
            secretKey={secretKey} // Secret key for organization
            backRoute={props.backRoute} // Route, where back button takes user. If undefined, it takes automatically to previous route
            backButton={props.backButton}
            setShowPlayer={setShowPlayer}
            campaignIDD={campaignID}
            isSerie={props.isSerie}
            license={organization.radiantPlayerLicense}
            //key={assetId} // For react's re-rendering purposes
          />
        </div>
      </div>
    );
  } else if (
    user &&
    assetId !== '' &&
    organizationId !== '' &&
    showPlayer === 'wantedHidden'
  ) {
    return (
      <div className='showPlayerBar'>
        <button
          className='showPlayerBTN'
          onClick={() => setShowPlayer('visible')}
        >
          {t('videoPlayer.showPlayer')}
        </button>
      </div>
    );
  } else {
    return null;
  }
};

export default AssetVideoPlayer;
