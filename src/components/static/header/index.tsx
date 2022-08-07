import React, {useMemo, useState} from 'react';
import './style.css';
import logo from './assets/dm_logo.png'
import {HeaderMenuElement} from "../../../model/header-menu-element";
import {Link, NavLink} from "react-router-dom";
import sidebarIcon from './assets/sidebar.png'

const Header = (props: { menuElements: HeaderMenuElement[] }) => {
    const [menuCollapsed, setMenuCollapsed] = useState(true)
    const [menuCollapsing, setMenuCollapsing] = useState(false)

    const buildHeaderElements = useMemo(() => {
        if(props.menuElements)
        return props.menuElements.map((menuElement) => {
            return <NavLink
                key={menuElement.menuName}
                className='nav_link'
                to={menuElement.menuRoute}>
                <li key={menuElement.menuName}
                    className="header__menu__element">
                    {menuElement.menuName}
                </li></NavLink>})
    }, [props.menuElements])

    const buildHeaderSidebarElements = useMemo(() => {
        if (props.menuElements && (!menuCollapsed || menuCollapsing))
        return props.menuElements.map((menuElement) => {
            return <NavLink
                key={menuElement.menuName}
                className='nav_link'
                to={menuElement.menuRoute}>
                <li className='header__sidebar__element'
                    key={menuElement.menuName} onClick={() => {
                    if (menuCollapsing) {
                        setMenuCollapsed(!menuCollapsed)
                    } else {
                        setMenuCollapsing(true)
                    }}
                }>{menuElement.menuName}</li></NavLink>
        })
    }, [menuCollapsed, menuCollapsing, props.menuElements])

    const getMenuClass = () => {
        if((menuCollapsing && menuCollapsed) || (!menuCollapsing && !menuCollapsed)) {
            return " header__sidebar__menu__expanded"
        }
        return " header__sidebar__menu__collapsed"
    }

    return (
        <div className="header__container">
            <Link to='/'><img src={logo} alt="Логотип"/></Link>
            <ul className="header__menu__elements__container">
                {buildHeaderElements}
            </ul>
            <div className='header__sidebar'>
                <img className='header__sidebar_icon' src={sidebarIcon} alt={'Меню'} height={'32px'}
                     onClick={() => setMenuCollapsing(true)}/>
                <div className={"header__sidebar__menu" + getMenuClass()}
                    onTransitionEnd={() => {
                        setMenuCollapsed(!menuCollapsed)
                        setMenuCollapsing(false)
                    }}>
                    {buildHeaderSidebarElements}
                </div>
            </div>
        </div>
    );
};

export default Header;