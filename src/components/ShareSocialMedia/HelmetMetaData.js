import React from 'react';
import { Helmet } from 'react-helmet-async';
import { organization } from '../../configs/config_settings.json';

export default function HelmetMetaData(props) {
  console.log(props);

  let currentUrl = window.location.href;
  console.log(currentUrl);
  let quote = props.quote !== undefined ? props.quote : '';
  let title = props.title !== undefined ? props.title : '';
  let image = props.image !== undefined ? props.image : '';
  let description = props.description !== undefined ? props.description : '';
  let hashtag = props.hashtag !== undefined ? props.hashtag : '';

  return (
    <Helmet>
      <title>{title}</title>
      <meta charset='utf-8' />
      <meta http-equiv='X-UA-Compatible' content='IE=edge' />
      <meta name='csrf_token' content='' />
      <meta property='type' content='website' />
      <meta property='url' content={currentUrl} />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, shrink-to-fit=no'
      />
      <meta name='msapplication-TileColor' content='#ffffff' />
      <meta name='msapplication-TileImage' content='/ms-icon-144x144.png' />
      <meta name='theme-color' content='#ffffff' />
      <meta name='_token' content='' />
      <meta name='robots' content='noodp' />
      <meta property='title' content={title} />
      <meta property='quote' content={quote} />
      <meta name='description' content={description} />
      <meta property='image' content={image} />
      <meta property='og:locale' content='en_US' />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={title} />
      <meta property='og:quote' content={quote} />
      <meta property='og:hashtag' content={hashtag} />
      <meta property='og:image' content={image} />
      <meta content='image/*' property='og:image:type' />
      <meta property='og:url' content={currentUrl} />
      <meta property='og:site_name' content={organization.name} />
      <meta property='og:description' content={description} />
    </Helmet>
  );
}

/*
import React from 'react';
import { Helmet } from 'react-helmet';

const ShareTwitter = (props) => {

    const {description, title, image, url } = props;

    return (
            <Helmet>
                <meta property="og:description" content={description} />
                <meta property="og:url" content={url} />
                <meta property="og:title" content={title} />
                <meta property="og:image" content={image} />
            </Helmet>
    )
}

export default ShareTwitter;

/*
<meta property="og:url" content="http://www.nytimes.com/2015/02/19/arts/international/when-great-minds-dont-think-alike.html" />
<meta property="og:type" content="article" />
<meta property="og:title" content="When Great Minds Don’t Think Alike" />
<meta property="og:description" content="How much does culture influence creative thinking?" />
<meta property="og:image" content="http://static01.nyt.com/images/2015/02/19/arts/international/19iht-btnumbers19A/19iht-btnumbers19A-facebookJumbo-v2.jpg" />

*/
