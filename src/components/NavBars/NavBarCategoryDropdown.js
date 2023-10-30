import { useMyContext } from '../../contexts/StateHolder';
import { NavLink } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

// Renders contentRatings of chosen item
const NavBarCategoryDropDown = (props) => {
  // Bring stateholders from context
  const {
    allCategories,
    setChosenCategory,
    chosenTab,
    setChosenTab,
    closeHamMenu,
    isResponsiveclose,
  } = useMyContext();

  const [viewDropdown, setViewDropdown] = useState(false);

  const { t } = useTranslation();

  const clickCategory = (categoryObj) => {
    console.log(props);
    setChosenCategory(categoryObj);
    closeHamMenu();
  };

  // Use ref to make sure react renders properly when clicking outside of box
  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      // Set loginForm to false, if clicked on outside of element
      function handleClickOutside(event) {
        if (event.target.className === 'navBarBTN categories selected') {
          // Do nothing as button's onClick effect will deal with toggle (clicked button)
        } else if (ref.current && !ref.current.contains(event.target)) {
          // Hide dropdown
          setViewDropdown(false);
        }
      }

      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  };

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  const renderDropdownButtons = () => {
    // Map through modified categories and make unique clickable button from every categoryName
    return allCategories.map((category, i) => {
      return (
        <NavLink
          className='dropdownOption'
          key={category + i}
          onClick={() => {
            clickCategory(category);
          }}
          to={`/${props.route}/${category.id}`}
          value={category.id}
          style={props.styles?.dropdownOption}
        >
          {category.title.toUpperCase()}
        </NavLink>
      );
    });
  };

  const renderDropdown = () => {
    return (
      <div
        className='categoriesDropdown'
        style={
          viewDropdown
            ? {
                ...props.styles?.categoriesDropdown,
                display: 'flex',
              }
            : {
                ...props.styles?.categoriesDropdown,
                display: 'none',
              }
        }
        ref={wrapperRef}
      >
        {allCategories ? renderDropdownButtons() : null}
      </div>
    );
  };
  console.log(chosenTab);
  return (
    <div
      className={
        chosenTab === 'categories'
          ? 'navBarBTN categories selected '
          : 'navBarBTN categories '
      }
      style={props.styles.navBarBTN}
      onClick={() => {
        setChosenTab('categories');
        setViewDropdown(viewDropdown ? false : true);
      }}
    >
      <div className='categories_info'>
        {t('navBarCategoryDropDown.categories')}
        {!isResponsiveclose ? <FiChevronDown /> : <FiChevronRight />}
      </div>

      {renderDropdown()}
    </div>
  );
};

export default NavBarCategoryDropDown;
