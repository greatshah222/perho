import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as classes from './DetailsShare.module.css';
import HelmetMetaData from '../ShareSocialMedia/HelmetMetaData';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { organization } from '../../configs/config_settings.json';
import Modal from 'react-modal';
import { useEffect, useState } from 'react';
Modal.setAppElement(document.body);

const DetailsShare = (props) => {
  const [showEmbedModal, setshowEmbedModal] = useState(false);

  const [embedText, setEmbedText] = useState(null);

  const [textCopied, setTextCopied] = useState(false);

  console.log(props.chosenItem);

  const handleCloseDialog = () => {};
  console.log(window.location);

  useEffect(() => {
    setTextCopied(false);
    let src;

    if (props.chosenItem?.series?.length > 0) {
      src = `${window.location.origin}/embed/vod/${organization.organizationId}/${props.chosenItem.id}`;
      setEmbedText(
        `<iframe src="${src}" scrolling='no'allow='fullscreen' width='880px' height='495px' allowfullscreen='true' title='Embed Links'></iframe>
         `
      );
    }
  }, [props.chosenItem?.series?.length, props.chosenItem.id]);
  const copyEmbedLink = () => {
    const el = document.createElement('textarea');
    el.value = embedText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setTextCopied(true);
  };

  useEffect(() => {
    if (textCopied) {
      setTimeout(() => {
        setTextCopied(false);
        if (showEmbedModal) {
          setshowEmbedModal(false);
        }
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textCopied]);

  return (
    <>
      <div className={`${classes.details_share}`}>
        {/* <HelmetMetaData
          image={
            // props.chosenItem?.bannerImageSmall ||
            // props.chosenItem?.coverImageSmall ||
            // props.chosenImage?.thumbnailSmall
            'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2787&q=80'
          }
          title={props.chosenItem?.title || props.chosenItem?.name}
          description={
            props.chosenItem?.ingress || props.chosenItem?.description
          }
        /> */}

        <FacebookShareButton
          url={window.location.href}
          quote={`${
            props.chosenItem?.serie?.title ||
            props.chosenItem?.title ||
            props.chosenItem?.name
          }\n\n
        ${
          props.chosenItem?.serie?.description ||
          props.chosenItem?.ingress ||
          props.chosenItem?.description
        }
        `}
          hashtag={`#${organization.name}`}
          image={
            props.chosenItem?.bannerImageSmall ||
            props.chosenItem?.coverImageSmall ||
            props.chosenImage?.thumbnailSmall
          }
          className={classes.socialMediaButton}
        >
          <FontAwesomeIcon
            icon={['fab', 'facebook']}
            className={`${classes.shareBTN} `}
          />
        </FacebookShareButton>

        <TwitterShareButton
          url={window.location.href}
          title={`${props.chosenItem?.title || props.chosenItem?.name}
          \n`}
          image={
            props.chosenItem?.bannerImageSmall ||
            props.chosenItem?.coverImageSmall ||
            props.chosenImage?.thumbnailSmall
          }
          hashtags={[...(organization.name ? [organization.name] : [])]}
          //via='Somenamehere, shows up like @something in end of tweet'
          className={classes.socialMediaButton}
        >
          <FontAwesomeIcon
            icon={['fab', 'twitter']}
            className={`${classes.shareBTN}  `}
          />
        </TwitterShareButton>

        {!props.isSerieCategory && (
          <div className={classes.socialMediaButton}>
            <FontAwesomeIcon
              icon='code'
              className={`${classes.shareBTN} `}
              onClick={() => setshowEmbedModal(true)}
            />
          </div>
        )}
      </div>
      <Modal
        isOpen={showEmbedModal}
        contentLabel='Select Date'
        className={'modal'}
        overlayClassName={'overlay'}
        onRequestClose={handleCloseDialog}
      >
        {embedText && (
          <div className='copy-popup'>
            <textarea
              type='text'
              max-length='35'
              className='embed-link font-300'
              value={embedText}
              onChange={({ target }) => setEmbedText(target.value)}
            />
            <div className='series-seasons-numbers font-400'>
              <button
                className='seasonNumber activeSeason'
                onClick={() => copyEmbedLink()}
              >
                Copy
              </button>
              <button
                onClick={() => setshowEmbedModal(false)}
                className='seasonNumber  '
              >
                {' '}
                Close
              </button>
            </div>
          </div>
        )}
        <div class={textCopied ? 'copy-container active' : 'copy-container'}>
          <div class={textCopied ? 'copy-popup active' : 'copy-popup'}>
            <div className='font-400'>Copied to clipboard!</div>
            <div className='font-300'>&#128077;</div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DetailsShare;

/*
<Link
        to={{
          pathname: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${props.chosenItem.name}`,
        }}
        target='_blank'
        rel='noreferrer noopener'
      >
        <FontAwesomeIcon
          icon={['fab', 'facebook']}
          className='shareBTN shareFB font-800'
        />
      </Link>

      <Link
        to={{
          pathname: `https://twitter.com/share?text=${props.chosenItem.name} url=${window.location.href}&image=${props.chosenItem.coverImageSmall}`,
        }}
        target='_blank'
        rel='noreferrer noopener'
      >
        <FontAwesomeIcon
          icon={['fab', 'twitter']}
          className='shareBTN shareTW font-800'
        />
      </Link>
*/
