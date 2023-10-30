import { NavLink } from 'react-router-dom';
import { getImageByKey } from '../../scripts/getImageByKey';
import { useTranslation } from 'react-i18next';
import * as classes from './NavBar.module.css';
import { FiAlignRight, FiXCircle } from 'react-icons/fi';
import { useState } from 'react';
import { useMyContext } from '../../contexts/StateHolder';

const NavBar = ({ links, siteLogo, extraClassname }) => {
  const { t } = useTranslation();

  const {
    isMenu,
    setisMenu,
    closeHamMenu,
    isResponsiveclose,
    setResponsiveclose,
  } = useMyContext();
  // for main navigation mobile menu
  const toggleClass = () => {
    setisMenu(isMenu === false ? true : false);
    setResponsiveclose(isResponsiveclose === false ? true : false);
  };

  let boxClass = ['main-menu menu-right menuq1'];
  if (isMenu) {
    boxClass.push('menuq2');
  } else {
    boxClass.push('');
  }
  console.log(extraClassname);
  // for dropdown navigation mobile menu
  const [isMenuSubMenu, setMenuSubMenu] = useState(false);

  const toggleSubmenu = () => {
    setMenuSubMenu(isMenuSubMenu === false ? true : false);
  };

  console.log(toggleSubmenu);

  let boxClassSubMenu = ['sub__menus'];
  if (isMenuSubMenu) {
    boxClassSubMenu.push('sub__menus__Active');
  } else {
    boxClassSubMenu.push('');
  }

  return (
    <div
      className={
        extraClassname
          ? `${classes.navBar} ${extraClassname}`
          : `${classes.navBar}`
      }
    >
      <NavLink to='/' exact activeClassName='no-class'>
        <img
          className='navBarSiteLogo'
          src={
            siteLogo && siteLogo !== '' ? siteLogo : getImageByKey('siteLogo')
          }
          title={t('navBar.backToHome')}
          alt='SiteName'
          onClick={closeHamMenu}
        ></img>
      </NavLink>

      <nav className={`${classes.navBarRow} main-nav `}>
        {isResponsiveclose === true ? (
          <>
            <span
              className='menubar__button'
              style={{ display: 'none' }}
              onClick={toggleClass}
            >
              {' '}
              <FiXCircle />{' '}
            </span>
          </>
        ) : (
          <>
            <span
              className='menubar__button'
              style={{ display: 'none' }}
              onClick={toggleClass}
            >
              {' '}
              <FiAlignRight />{' '}
            </span>
          </>
        )}

        <ul className={` ${classes.navBarRow_primary} ${boxClass.join(' ')}`}>
          {links}
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
