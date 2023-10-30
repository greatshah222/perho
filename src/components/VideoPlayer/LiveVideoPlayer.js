import { useMyContext } from '../../contexts/StateHolder';
import LivePlayer1 from './LivePlayer1';
import { useEffect, useState } from 'react';
import settings from '../../configs/config_settings.json';
import { useCookies } from 'react-cookie';
import { useMyContextFunctions } from '../../contexts/ContextFunctions';

const LiveVideoPlayer = (props) => {
  // Bring stateholders from context
  const { key, organizationId, liveChannelPrivate } = useMyContext();

  const [channelServiceId, setChannelServiceId] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [companyId, setCompanyId] = useState(null);

  const { redirectUserToLogin } = useMyContextFunctions();
  const [cookies] = useCookies('');
  console.log(cookies);

  useEffect(() => {
    if (organizationId) {
      setGroupId(settings.organization.groupId);
      setChannelServiceId(settings.organization.channelServiceId);
      setCompanyId(settings.organization.companyId);
    }
  }, [organizationId]);
  useEffect(() => {
    if (liveChannelPrivate) {
      !cookies.userData.userId && redirectUserToLogin('login');
    }
  }, [redirectUserToLogin, cookies.userData, liveChannelPrivate]);

  return key && channelServiceId && companyId ? (
    <div className='maxContainerPrimary'>
      <LivePlayer1
        companyId={companyId}
        groupId={groupId} // Group of organization
        organizationId={organizationId} // Id of organization
        playerAutoStart={props.playerAutoStart}
        secretKey={key} // Secret key for organization
        channelServiceId={channelServiceId} // channelServiceId for live video
        backRoute={props.backRoute} // Route, where back button takes user. If undefined, it takes automatically to previous route
        //key={assetId} // For react's re-rendering purposes
        userId={liveChannelPrivate ? cookies.userData.userId : 0}
        license={settings.organization.radiantPlayerLicense}
      />
    </div>
  ) : null;
};

export default LiveVideoPlayer;
