import React, {useState} from 'react';
import './header.css';
import logo from './dm_logo.png'
import {HeaderMenuElement} from "./headerMenuElement";
import {Link, NavLink} from "react-router-dom";
import 'react-pro-sidebar/dist/css/styles.css';
import sidebarIcon from'./sidebar.png'

const Header = (props: { menuElements: HeaderMenuElement[] }) => {
    const [menuCollapsed, setMenuCollapsed] = useState(true)
    const menuClick = () => {
        menuCollapsed ? setMenuCollapsed(false) : setMenuCollapsed(true)
    }
    return (
        <div className="header__main">
            <div className="header__contents">
                <Link to='/'><img src={logo} alt="Логотип"/></Link>
                <ul className="header__menu_elements">
                    {props.menuElements && props.menuElements.map((menuElement) => {
                        return <NavLink
                            key={menuElement.menuName}
                            className='nav_link'

                            to={menuElement.menuRoute}>
                            <li key={menuElement.menuName} className="header__menu_element">
                            {menuElement.menuName}
                            </li></NavLink>
                    })}
                </ul>
                <div className='header__sidebar'>
                    <img className='header__sidebar_icon' src={sidebarIcon} alt={'Меню'} height={'32px'} onClick={menuClick}/>
                    <div className="header__sidebar_menu" style={{
                        right: menuCollapsed ? '-300px' : '0'}}>
                        {!menuCollapsed && props.menuElements && props.menuElements.map((menuElement) => {
                            return <NavLink
                                key={menuElement.menuName}
                                className='header__sidebar_nav_link'

                                to={menuElement.menuRoute}>
                                <li className='header__sidebar_li' key={menuElement.menuName} onClick={menuClick}>
                                    {menuElement.menuName}
                                </li></NavLink>
                        })}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Header;