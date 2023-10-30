import fi_all_ages from '../images/contentRatings/fi_all_ages.png';
import fi_above_7 from '../images/contentRatings/fi_above_7.png';
import fi_above_12 from '../images/contentRatings/fi_above_12.png';
import fi_above_16 from '../images/contentRatings/fi_above_16.png';
import fi_above_18 from '../images/contentRatings/fi_above_18.png';
import fi_distress from '../images/contentRatings/fi_distress.png';
import fi_sex from '../images/contentRatings/fi_sex.png';
import fi_violence from '../images/contentRatings/fi_violence.png';
import fi_drugs from '../images/contentRatings/fi_drugs.png';
import siteLogo from '../images/siteLogos/siteLogo.png';
import siteLogo2 from '../images/siteLogos/siteLogo2.png';
import hhjLogo from '../images/siteLogos/HHJ-logo.png';
import flag_fi from '../images/language/flags/flag_fi.png';
import flag_en from '../images/language/flags/flag_en.png';
import flag_sv from '../images/language/flags/flag_sv.png';
import signUpBackground from '../images/defaultImages/signUpBackground.png';
import symbolX from '../images/defaultIcons/symbolX.png';
import subOrganization_default_image from '../images/defaultImages/bannerdemo_image1.jpeg';
import no_data_available from '../images/defaultIcons/no_data_available.svg';
import no_channels_available from '../images/defaultIcons/no_channels_available.svg';
import icareus_event_default from '../images/defaultImages/events_page_default_image.jpeg';
import editorChoiceIcon from '../images/defaultIcons/Editor’s-Choice.svg';
import playButtonPoster from '../images/defaultIcons/playButtonPoster.png';
import guidesDesktop from '../images/defaultImages/guidesDesktop.PNG';
import guidesMobile from '../images/defaultImages/guidesMobile.PNG';
import guidesChromecast from '../images/defaultImages/guidesChromecast.PNG';
import comingSoon from '../images/defaultImages/comingSoon.jpg';
import comingSoonThumbnail from '../images/defaultImages/comingSoonThumbnail.jpg';
import comingSoonThumbnailSerie from '../images/defaultImages/comingSoonThumbnailSerie.jpg';
import bannerdemo from '../images/defaultImages/banner_demo.jpeg';

const images = {
  bannerdemo,
  fi_all_ages,
  fi_above_7,
  fi_above_12,
  fi_above_16,
  fi_above_18,
  fi_distress,
  fi_sex,
  fi_violence,
  fi_drugs,
  siteLogo,
  siteLogo2,
  flag_fi,
  flag_en,
  flag_sv,
  comingSoon,
  signUpBackground,
  symbolX,
  subOrganization_default_image,
  no_channels_available,
  no_data_available,
  icareus_event_default,
  editorChoiceIcon,
  playButtonPoster,
  guidesDesktop,
  guidesMobile,
  guidesChromecast,
  comingSoonThumbnail,
  comingSoonThumbnailSerie,
  hhjLogo,
};

const getImageByKey = (key) => {
  return images[key];
};

export { getImageByKey };
