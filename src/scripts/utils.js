import settings from '../configs/config_settings.json';
import moment from 'moment';
const crypto = require('crypto');

// Converts seconds to hours and minutes
const convertDuration = (dur) => {
  const dS = Number(dur);

  const h = Math.floor(dS / 3600);
  const m = Math.floor((dS % 3600) / 60);
  const s = Math.floor((dS % 3600) % 60);
  if (h > 0 && m > 0 && s > 0) {
    return `${h} h ${m} m ${s} s`;
  } else if (h > 0 && m === 0) {
    return `${h} h`;
  } else if (h === 0 && m > 0) {
    return `${m} m ${s} s`;
  } else if (h === 0 && m === 0 && s > 0) {
    return ` ${s} s`;
  } else {
    return '0 s';
  }
};

const momentDate = (el) => {
  return moment(el).locale('fi').format(' dddd,  DD.MM.YYYY ');
};
const trancuateDesc = (text, sizes, maxLines) => {
  // return text.length > sizes
  //   ? `${clip(text, sizes, {
  //       html: true,
  //       maxLines: maxLines ? maxLines : 3,
  //     })}`
  //   : text;

  // https://stackoverflow.com/questions/5454235/shorten-string-without-cutting-words-in-javascript

  if (text.length > sizes) {
    return text.substr(0, text.lastIndexOf(' ', sizes)) + '...';
  } else {
    return text;
  }
};

const trancuate = (text, size, maxLines) => {
  // return text.length > size
  //   ? `${clip(text, size, {
  //       html: true,
  //       maxLines: maxLines ? maxLines : 3,
  //     })}`
  //   : text;

  if (text.length > size) {
    return text.substr(0, text.lastIndexOf(' ', size)) + '...';
  } else {
    return text;
  }
};
const convertCurrency = (currency) => {
  switch (currency.toLowerCase()) {
    case 'eur':
      return '€';
    case 'ksh':
      return 'KsH';
    case 'dol':
      return '$';
    default:
      return '';
  }
};

// TOKEN CREATOR
const createToken = (organizationId, groupItemId, key) => {
  const currentTime = getCurrentTime();
  const signature = crypto
    .createHash('md5')
    .update(`${organizationId}:${groupItemId}:${currentTime}:${key}`)
    .digest('hex');

  return '05' + currentTime + signature;
};

// TOKEN CREATOR FOR ASSETS
const createAssetIdToken = (organizationId, assetId, languageId, key) => {
  const currentTime = getCurrentTime();
  let signature;

  if (!languageId) {
    signature = crypto
      .createHash('md5')
      .update(`${organizationId}:${assetId}:${currentTime}:${key}`)
      .digest('hex');
  } else {
    signature = crypto
      .createHash('md5')
      .update(
        `${organizationId}:${assetId}:${languageId}:${currentTime}:${key}`
      )
      .digest('hex');
  }

  return '03' + currentTime + signature;
};

// TOKEN CREATOR FOR ACCOUNT MANAGEMENT
const createAccountToken = (
  userId,
  organizationId,
  key,
  firstName,
  lastName,
  phoneNumber,
  countryId,
  regionId,
  cityName,
  postalCode,
  eMail
) => {
  const currentTime = getCurrentTime();
  const signature = crypto
    .createHash('md5')
    .update(
      `${organizationId}:${userId}:${firstName}:${lastName}:${countryId}:${regionId}:${postalCode}:${cityName}:${phoneNumber}:${currentTime}:${key}`
    )
    .digest('hex');

  return '01' + currentTime + signature;
};

// TOKEN CREATOR FOR PASSWORD CHANGING PROCESS
const createChangePasswordToken = (
  organizationId,
  key,
  userId,
  newPassword,
  confirmPassword
) => {
  const currentTime = getCurrentTime();
  const signature = crypto
    .createHash('md5')
    .update(
      `${organizationId}:${userId}:${newPassword}:${confirmPassword}:${currentTime}:${key}`
    )
    .digest('hex');

  return '01' + currentTime + signature;
};

// GroupItemId creates string from category id:s, separated with comma and returns it to main program
const createGroupItemId = (categories, exclude) => {
  let groupItemId = '';

  // Add id:s to string, separating with comma. On last item, dont add comma.
  for (let i = 0; i < categories.length; i++) {
    if (exclude && !exclude.includes(categories[i].id)) {
      if (i === categories.length - 1) {
        groupItemId += `${categories[i].id}`;
      } else {
        groupItemId += `${categories[i].id},`;
      }
    } else if (!exclude) {
      if (i === categories.length - 1) {
        groupItemId += `${categories[i].id}`;
      } else {
        groupItemId += `${categories[i].id},`;
      }
    }
  }
  return groupItemId;
};

// Checks if element is being hovered and if there's any stylechanges in style config
const checkStyle = (style, hovering, element, value) => {
  // If style exists and there's modified values on requested element
  if (style && style[element]) {
    // Get modified values to newStyle
    let newStyle = { ...style[element] };
    // Go through keys of newStyle (name of style to be modified, like background, color... )
    Object.keys(newStyle).forEach((key) => {
      // If key has style for Hover (backgroundHover, colorHover....) AND mouse is currently hovering over element
      if (newStyle[key + 'Hover'] && hovering === value) {
        // Modify main key (ex. background...) with hovering value (backgroundHover: black -> background: black)
        newStyle[key] = newStyle[key + 'Hover'];
      }
    });
    // Return modified style to component
    return newStyle;
  }
};

// Fisher-Yates (aka Knuth) Shuffle
const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const checkVod = (routes, pathname) => {
  let vod = '';
  // Check current location, if it's svod or tvod side of a site
  if (pathname.includes(routes.svod)) {
    vod = routes.svod;
  } else {
    vod = routes.tvod;
  }
  return vod;
};

// Checks if all arguments of a function are defined
const checkArguments = (...args) => {
  return args.every((arg) => arg !== undefined);
};
const modifySlickSettings = (settings, items) => {
  if (checkArguments(settings.responsive, items)) {
    console.log(settings.responsive, items, window.innerWidth, 'window');

    // Check number of slides to show from correct responsitivity setting
    const slides = settings.responsive.find(
      (resp) => window.innerWidth >= resp.breakpoint
    ).settings.slidesToShow;

    // If there's less or equal amount of items in category than there's slidesToShow, set slick infinite to false to prevent duplicates (slick bug)
    if (items <= slides) {
      settings.infinite = false;
    }
    return settings;
  }
};

// Get current time for token creators
const getCurrentTime = () => {
  return Math.floor(new Date().getTime() / 1000).toString(16);
};

// Removes punctuation from string
const removePunctuation = (v) => {
  console.log(settings.language);
  // Punctuaton is only for greek language
  if (settings.language !== 'el_GR') return v;
  if (v && v !== '') {
    v = v.replace(/Ά/g, 'Α');
    v = v.replace(/Ή/g, 'Η');
    v = v.replace(/Ί/g, 'Ι');
    v = v.replace(/Ό/g, 'Ο');
    v = v.replace(/Έ/g, 'Ε');
    v = v.replace(/Ύ/g, 'Υ');
    v = v.replace(/Ώ/g, 'Ω');
    v = v.replace(/ή/g, 'h');
    v = v.replace(/ό/g, 'o');
    v = v.replace(/ά/g, 'a');
    v = v.replace(/ί/g, 'i');
    v = v.replace(/ύ/g, 'y');
    console.log(v);
    return v.toUpperCase();
  }
};

const removePunctuationFromResponse = (array) => {
  if (Array.isArray(array)) {
    array.forEach((item) => {
      item.description = removePunctuation(item.description);
      item.ingress = removePunctuation(item.ingress);
      item.name = removePunctuation(item.name);
      item.title = removePunctuation(item.title);
    });
    return array;
  } else {
    const item = array;
    item.description = removePunctuation(item.description);
    item.ingress = removePunctuation(item.ingress);
    item.name = removePunctuation(item.name);
    item.title = removePunctuation(item.title);
    return item;
  }
};

export {
  convertDuration,
  checkStyle,
  createToken,
  createAssetIdToken,
  createAccountToken,
  createChangePasswordToken,
  createGroupItemId,
  shuffle,
  checkVod,
  modifySlickSettings,
  checkArguments,
  removePunctuation,
  removePunctuationFromResponse,
  trancuate,
  trancuateDesc,
  convertCurrency,
  momentDate,
};
