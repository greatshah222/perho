import { useMyContext } from '../../contexts/StateHolder';
import { useHistory } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BsChevronDown } from 'react-icons/bs';
import { BsChevronUp } from 'react-icons/bs';
import './CategoryDropdown.css';

// TODO: Make it work like with different modes (RenderCategoriesWithTitles): 1 = categoriesById given in props, 2 = allCategories...

// Renders contentRatings of chosen item
const RenderCategoryDropdown = (props) => {
  // Bring stateholders from context
  const { allCategories, setChosenCategory } = useMyContext();

  const [viewDropdown, setViewDropdown] = useState(false);

  const history = useHistory();

  const { t } = useTranslation();

  const clickCategory = (categoryObj) => {
    // Set clicked category as chosenCategory
    setChosenCategory(categoryObj);

    // Switch to categories view
    history.push(`/${props.route}/${categoryObj.id}`);
  };

  // Use ref to make sure react renders properly when clicking outside of box
  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      // Set loginForm to false, if clicked on outside of element
      function handleClickOutside(event) {
        if (event.target.className === 'categoriesButton') {
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
  let active = viewDropdown ? 'active' : '';

  const renderDropdownButtons = () => {
    // Map through modified categories and make unique clickable button from every categoryName
    return allCategories.map((el, i) => {
      return (
        <li
          key={el + i}
          onClick={() => {
            clickCategory(el);
          }}
        >
          <div>{el.title}</div>{' '}
        </li>
      );
    });
  };

  const renderDropdown = () => {
    return (
      <div className='wrapper-demo' ref={wrapperRef}>
        <div
          className={`wrapper-dropdown-2 ${active} text_secondary`}
          onClick={() => {
            setViewDropdown(viewDropdown ? false : true);
          }}
        >
          <div className='info'>
            {t('categoryDropdown.categories')}
            {viewDropdown ? (
              <BsChevronUp className='svg-chevron' />
            ) : (
              <BsChevronDown className='svg-chevron' />
            )}
          </div>

          <ul className='dropdown'>
            {allCategories ? renderDropdownButtons() : null}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className='categoriesBar'>
      <div className='categoriesButtonContainer'>{renderDropdown()}</div>
    </div>
  );
};

export default RenderCategoryDropdown;
