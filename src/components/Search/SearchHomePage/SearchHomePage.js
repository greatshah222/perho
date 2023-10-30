import { useTranslation } from 'react-i18next';

import * as classes from './SearchHomePage.module.css';
import { FaSearch, FaChevronLeft } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { useMyContext } from '../../../contexts/StateHolder';
import { useEffect, useState } from 'react';

const SearchHomePage = () => {
  // Bring stateholders from context
  const {
    searchFieldInput,
    setSearchFieldInput,

    setSearchInitiatedByOtherPage,
  } = useMyContext();

  //_ dont shoe back button on home page

  const [backButtonHidden, setBackButtonHidden] = useState(false);

  // Setup translate function
  const { t } = useTranslation();

  const history = useHistory();

  useEffect(() => {
    console.log(history, 'history');
    if (history.location.pathname === '/') {
      setBackButtonHidden(true);
    } else {
      setBackButtonHidden(false);
    }

    return () => {
      // we will reset the search when user is on other page
      setSearchFieldInput('');
    };
  }, [history.location.pathname, history, setSearchFieldInput]);

  const reRouteOriginalSearch = (e) => {
    e.preventDefault();
    setSearchInitiatedByOtherPage(true);

    return history.push('/search');
  };

  const goBackToPreviousPage = () => {
    // we also need to check if the next location ->it should not match our current search component route
    setSearchFieldInput('');
    if (history.location.pathname.includes('search')) {
      history.push('/');
    } else {
      history.goBack();
    }
  };

  return (
    <>
      <div className={classes.searchContainer}>
        <div className={classes.searchContainer_back}>
          {!backButtonHidden ? (
            <div
              className={classes.searchContainer_back_icon}
              onClick={goBackToPreviousPage}
            >
              <FaChevronLeft className={classes.FaIcon} />
              {t('search.back')}
            </div>
          ) : (
            <div> </div>
          )}
          <form
            id={classes.searchForm}
            onSubmit={(e) => reRouteOriginalSearch(e)}
          >
            <div className={classes.searchRow}>
              <div className={`${classes.searchColumn} font-300`}>
                <input
                  className={`${classes.searchField} font-300`}
                  type='text'
                  value={searchFieldInput}
                  onChange={(e) => setSearchFieldInput(e.target.value)}
                  placeholder={t('search.searchByName')}
                />
                <FaSearch
                  className={`${classes.FaIcon} ${classes.FaIconSearch}`}
                  onClick={reRouteOriginalSearch}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SearchHomePage;
