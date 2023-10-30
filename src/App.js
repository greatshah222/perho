import './App.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import CategoryContentSimilar from './components/ViewAssets/Sliders/CategoryContentSimilar';
import DetailsVideo from './components/Details/DetailsVideo';
//import DetailsSerie from './components/Details/DetailsSerie';
import ChosenCategoryGrid from './components/ViewAssets/Grids/ChosenCategoryGrid';
import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { useMyContext } from './contexts/StateHolder';
//import Profile from './components/Profile/Profile';
import settings from './configs/config_settings.json';

import CategoriesWithTitles from './components/ViewAssets/Sliders/CategoriesWithTitles';
import { getCategories } from './scripts/dataHandlers';
//import LanguageSelect from './components/LanguageSelect/LanguageSelect';
//import RenderCategoryDropdown from './components/DropDowns/CategoryDropdown';
//import LoginBTN from './components/Login/LoginBTN';
import AssetVideoPlayer from './components/VideoPlayer/AssetVideoPlayer';
//import SignUpForm from './components/SignUp/SignUpForm';
//import LoginForm from './components/Login/LoginForm';
import { useCookies } from 'react-cookie';
import './Shared/FontAwesomeIcon';
import 'react-multi-carousel/lib/styles.css';
import ListAllSeries from './components/ViewAssets/Sliders/Series/ListAllSeries';
import PurchaseFlow from './components/Packages/PurchaseFlow';
import HelmetMetaData from './components/ShareSocialMedia/HelmetMetaData';

//import UpcomingEvent from './components/Events/Event/UpcomingEvent';
import UpcomingEvents from './components/Events/EventsCategory/UpcomingEvents';
import LiveNowEvents from './components/Events/EventsCategory/LiveNowEvents';
//import EventsEditorChoice from './components/Events/EventsEditorChoice/EventsEditorChoice';
//import EditorChoice from './components/EditorChoice/EditorChoice';
import EventsCategory from './components/Events/EventsCategory/EventsCategory';
//import BannerSingleAsset from './components/ViewAssets/BannersSingleAsset/BannerSingleAsset';
import UpcomingEvent from './components/Events/Event/UpcomingEvent';
import DetailsSeasonsAndEpisodes from './components/Details/DetailsSeasonsAndEpisodes';
//import DetailsAssetBanner from './components/Details/DetailsAssetBanner';
import EventsCategoryItem from './components/Events/EventsCategory/EventsCategoryItem';
import { useTranslation } from 'react-i18next';
import SearchEmbed from './components/Search/SearchEmbed';
import SearchHomePage from './components/Search/SearchHomePage/SearchHomePage';

import siteLogo from '../src/images/defaultImages/signUpBackground.png';

// Google Analytics
import ReactGA from 'react-ga';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

// toastify
import 'react-toastify/dist/ReactToastify.css';
// import EventsByCategoryId from './components/Events/EventsCategory/EventsByCategoryId';
import SeriesAsset from './components/ViewAssets/Sliders/Series/SeriesAsset/SeriesAsset';

//import EpisodesWithSerieTitles from './components/ViewAssets/Sliders/Series/EpisodesWithSerieTitles/EpisodesWithSerieTitles';

if (settings.googleAnalytics !== '') {
  // Initialize Google analytics with API-key from .env file // TODO
  ReactGA.initialize(settings.googleAnalytics);
}

function App() {
  // Bring stateholders from context
  const {
    setAllCategories,

    key,
    setKey,

    organizationId,
    setOrganizationId,

    language,
    setLanguage,

    setBaseRoutes,

    user,
    setUser,
  } = useMyContext();

  const [cookies] = useCookies('');

  const { t } = useTranslation();
  const location = useLocation();

  // UseEffect that will re-trigger on every pagechange, sending current location to Google Analytics
  useEffect(() => {
    if (settings.organization.googleAnalytics !== '') {
      // Report Google Analytics about user entering this page
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }, [location]);

  /**** STEP 1, FIRST TIME INIT PROGRAM ****/
  useEffect(() => {
    async function initProgram() {
      try {
        // TODO: Import from suite, now importing just from config.json

        // Set organizationId to context
        setOrganizationId(settings.organization.organizationId);

        // Set key to context
        setKey(settings.organization.key);

        setBaseRoutes(settings.routes);

        console.log('app.js cookies: ', cookies);
        // If there's existing userToken in cookies
        if (cookies?.userData?.userToken) {
          // Get user from context and copy it to modifiedUser
          let modifiedUser = { ...user };

          // Change status of user as logged in
          modifiedUser.loggedIn = true;

          // Set userToken from cookies
          modifiedUser.userId = cookies?.userData?.userId;

          // Set userToken from cookies
          modifiedUser.userToken = cookies?.userData?.userToken;

          // Update user in context, with modified data
          setUser(modifiedUser);
        }

        // Set language from config and set it to context
        setLanguage(settings.language);
      } catch (err) {
        console.log(err);
      }
    }

    initProgram();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**** STEP 2, CHECK LANGUAGE AND GET CATEGORIES (STEP WILL BE REPEATED IF LANGUAGE CHANGES) ****/
  useEffect(() => {
    async function getAndSetCategories() {
      try {
        // Get categories from datahandler
        const categoryList = await getCategories(
          organizationId,
          key,
          language,
          user
        );

        // Set categories in context
        setAllCategories(categoryList);
      } catch (err) {
        console.log(err);
      }
    }

    // Get categories only if language is set
    if (language !== '') {
      getAndSetCategories();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className='App'>
      <div className='container'>
        <Switch>
          <Route>
            <HelmetMetaData
              title={'Perho'}
              description='Perho'
              image={siteLogo}
            />
            <SearchHomePage settings={settings.components.search_01} />

            <Route path='/' exact>
              <div style={{ width: '88%', margin: '0 auto 6% auto' }}>
                <LiveNowEvents
                  organizationId={settings.organization.organizationId}
                  extraClassname
                />

                <UpcomingEvents
                  organizationId={settings.organization.organizationId}
                  settings={settings.components.frontPageUpcomingEvents}
                  extraClassname
                />

                <SeriesAsset
                  settings={settings.components.frontPageCategories_01}
                  showDuration={false}
                  showReleaseYear={true}
                  showPublishedDate={true}
                  hideDescription={true}
                  latestData={true}
                  titleName={t('seriesSlider.latest')}
                  extraClassname={true}
                />

                <SeriesAsset
                  settings={settings.components.frontPageCategories_01}
                  showDuration={false}
                  showReleaseYear={true}
                  showPublishedDate={true}
                  hideDescription={true}
                  titleName={t('seriesSlider.trending')}
                  extraClassname={true}
                />
                <CategoriesWithTitles
                  settings={settings.components.frontPageCategories_02}
                  extraClassname={true}
                />
              </div>
            </Route>

            {/* details page of upcoming event */}

            <Route>
              <Route path={`/${settings.routes.upcomingEvent}`} exact>
                <UpcomingEvent routes={settings.routes} />
              </Route>

              <Route
                path={`/${settings.routes.packages}/:itemType?/:itemId?`}
                exact
              >
                <PurchaseFlow settings={settings.components.purchaseflow} />
              </Route>

              {/* We get Events based on categoryId and show them to user */}

              <Route path={`/${settings.routes.eventBasedOnCategory}`} exact>
                <div
                  style={{
                    paddingBottom: '20px',
                    width: '88%',
                    margin: '0 auto',
                  }}
                >
                  <EventsCategoryItem
                    settings={settings.components.EventsCategoryItem}
                  />
                </div>
              </Route>

              {/* ROUTE FOR SERIES VIEW*/}
              <Route path={`/${settings.routes.series}`} exact>
                <ListAllSeries
                  settings={settings.components.SeriesListAllSeries_01}
                  titleName={t('seriesSlider.title')}
                />
              </Route>

              {/* ROUTE FOR EVENTS VIEW*/}
              <Route path={`/${settings.routes.events}`} exact>
                <div
                  style={{
                    paddingBottom: '20px',
                    width: '88%',
                    margin: '0 auto',
                  }}
                >
                  <UpcomingEvents
                    organizationId={settings.organization.organizationId}
                    settings={settings.components.events}
                    extraClassname={true}
                  />
                  <LiveNowEvents
                    organizationId={settings.organization.organizationId}
                    settings={settings.components.events}
                    extraClassname={true}
                  />

                  <EventsCategory
                    organizationId={settings.organization.organizationId}
                    settings={settings.components.events}
                    extraClassname={true}
                  />
                </div>
              </Route>

              {/* ROUTE FOR VIDEO PLAY VIEW*/}
              <Route
                path={`/${settings.routes.svodVideoRoute}/:orgId/:asset`}
                exact
              >
                <div style={{ marginBottom: '5%' }}>
                  <AssetVideoPlayer
                    backRoute={'hidden'}
                    playerAutoStart={true}
                    backButton={false}
                  />

                  <DetailsVideo
                    hideBanner={true}
                    hideInfoData={true}
                    routes={settings.routes}
                  />
                  <CategoryContentSimilar
                    settings={settings.components.svodSimilar_01}
                    extraClassname
                  />
                </div>
              </Route>

              {/* ROUTE FOR SERIE PLAY VIEW*/}
              <Route
                path={`/${settings.routes.svodSerieRoute}/:orgId/:asset`}
                exact
              >
                <div style={{ marginBottom: '5%' }}>
                  <AssetVideoPlayer
                    backRoute={'hidden'}
                    playerAutoStart={true}
                    backButton={false}
                  />

                  <DetailsVideo
                    routes={settings.routes}
                    hideBanner={true}
                    hideInfoData={true}
                  />
                  <DetailsSeasonsAndEpisodes
                    playVideoRoute={settings.routes.svodSerieRoute}
                  />
                </div>
              </Route>

              {/* ROUTE FOR VIDEOS VIEW*/}
              <Route path={`/${settings.routes.videos}`}>
                <div style={{ width: '88%', margin: '0 auto 6% auto' }}>
                  <CategoriesWithTitles
                    settings={settings.components.frontPageCategories_02}
                    extraClassname={true}
                  />
                </div>
              </Route>

              {/* ROUTE FOR CATEGORIES VIEW*/}
              <Route
                path={`/${settings.routes.svodCategoriesRoute}/:asset`}
                exact
              >
                <ChosenCategoryGrid
                  settings={settings.components.svodChosenCategoryGrid_01}
                />
              </Route>

              {/* ROUTE FOR SERIE CATEGORIES VIEW*/}
              <Route
                path={`/${settings.routes.svodSeriesCategoriesRoute}/:orgId/:asset`}
                exact
              >
                <div style={{ marginBottom: '5%' }}>
                  {/* //hideCta hides play button */}
                  <DetailsVideo
                    hideCta={true}
                    isSerie={true}
                    hideInfoData={true}
                  />
                  <DetailsSeasonsAndEpisodes
                    playVideoRoute={settings.routes.svodSerieRoute}
                  />
                </div>
              </Route>

              {/* ROUTE FOR SEARCH VIEW*/}
              <Route path={`/${settings.routes.search}`} exact>
                <SearchEmbed settings={settings.components.search_01} />
              </Route>
            </Route>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
