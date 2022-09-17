import React, {useMemo, useRef, useState} from 'react';
import './style.css';
import logo from './assets/dm_logo.png'
import {HeaderMenuElement} from "../../../model/header-menu-element";
import {Link, NavLink} from "react-router-dom";
import sidebarIcon from './assets/sidebar.png'
import {useAuth} from "../../../model/auth/firebase/auth";

const Header = (props: { menuElements: HeaderMenuElement[] }) => {
    const [sidebarState, setSidebarState] = useState<"closed" | "opened">("closed")
    const {currentUser} = useAuth()
    const sidebarRef = useRef<HTMLDivElement>(null)
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
                            key={menuElement.menuName} onClick={() => setSidebarState("closed")}>{menuElement.menuName}</li></NavLink>
        })
    }, [props.menuElements, currentUser])

    return (
        <menu className="header__container">
            <Link to='/'><img className="header__logo" src={logo} alt="Логотип"/></Link>
            {buildHeaderElements}
            <menu className='header__sidebar'>
                <img className='header__sidebar_icon' src={sidebarIcon} alt={'Меню'} height={'32px'}
                     onClick={() => {
                         if(sidebarState === "closed") {
                             if(sidebarRef.current) sidebarRef.current.style.display = "block"
                             setTimeout(() => setSidebarState("opened"), 1)
                         }
                         if(sidebarState === "opened") setSidebarState("closed")
                     }}/>
                <div ref={sidebarRef} style={{display: "none"}} className={"header__sidebar__menu"} data-state={sidebarState} onTransitionEnd={() => {
                    if(sidebarState === "closed" && sidebarRef.current) sidebarRef.current.style.display = "none"
                }}>
                    {buildHeaderSidebarElements}
                </div>
            </menu>
        </menu>
    );
};

export default Header;