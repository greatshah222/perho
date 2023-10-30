import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Iframe from 'react-iframe';
import * as classes from '../Events.module.css';
import Loader from 'react-loader-spinner';

export default function Event(props) {
  console.log(props);
  const [height, setHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  console.log(props);
  const history = useHistory();
  const { url } = history.location.state;
  console.log(url, 'url');
  console.log(height);
  useEffect(() => {}, []);
  const iframeLoaded = () => {
    setHeight(document.body.scrollHeight * 2);
    setLoading(false);
  };
  return (
    <div className={classes.event}>
      {loading && (
        <div className='display-flex-center'>
          {' '}
          <Loader type='TailSpin' color='#161eaf' />{' '}
        </div>
      )}
      <div style={{ display: !loading ? 'block' : 'none' }}>
        <Iframe
          url={url}
          width='100%'
          title='myId'
          id='myId'
          height={`${height}px`}
          className={classes.iframe}
          onLoad={() => iframeLoaded()}
          loading='lazy'
        ></Iframe>
      </div>
    </div>
  );
}
