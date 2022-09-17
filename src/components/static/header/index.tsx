import React, {useMemo, useState} from 'react';
import './style.css';
import logo from './assets/dm_logo.png'
import {HeaderMenuElement} from "../../../model/header-menu-element";
import {Link, NavLink} from "react-router-dom";
import sidebarIcon from './assets/sidebar.png'
import {useAuth} from "../../../model/auth/firebase/auth";

const Header = (props: { menuElements: HeaderMenuElement[] }) => {
    const [showSidebar, setShowSidebar] = useState(false)
    const {currentUser} = useAuth()
    const buildHeaderElements = useMemo(() => {
        if(props.menuElements) {
            return props.menuElements
                .filter((el) => el.accessLevel === 0 || currentUser?.canAccess(el.accessLevel))
                .map((menuElement) => {
                    return <NavLink
                        key={menuElement.menuName}
                        className='nav_link'
                        to={menuElement.menuRoute}>
                        <li key={menuElement.menuName}
                            className="header__menu__element">
                            {menuElement.menuName}
                        </li></NavLink>
            })
        }

    }, [props.menuElements, currentUser])

    const buildHeaderSidebarElements = useMemo(() => {
        if (props.menuElements)
            return props.menuElements
                .filter((el) => el.accessLevel === 0 || currentUser?.canAccess(el.accessLevel))
                .map((menuElement) => {
                    return <NavLink
                        key={menuElement.menuName}
                        className='nav_link'
                        to={menuElement.menuRoute}>
                        <li className='header__sidebar__element'
                            key={menuElement.menuName} onClick={() => setShowSidebar(false)}>{menuElement.menuName}</li></NavLink>
        })
    }, [props.menuElements, currentUser])

    return (
        <menu className="header__container">
            <Link to='/'><img className="header__logo" src={logo} alt="Логотип"/></Link>
            {buildHeaderElements}
            <menu className='header__sidebar'>
                <img className='header__sidebar_icon' src={sidebarIcon} alt={'Меню'} height={'32px'}
                     onClick={() => setShowSidebar(!showSidebar)}/>
                <div className={"header__sidebar__menu" + (showSidebar ? " expanded" : " collapsed")}>
                    {buildHeaderSidebarElements}
                </div>
            </menu>
        </menu>
    );
};

export default Header;