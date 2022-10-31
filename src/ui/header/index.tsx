import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import './style.css';
import logo from '../../assets/dm_logo.png'
import {HeaderMenuElement} from "../../model/header-menu-element";
import {Link, NavLink} from "react-router-dom";
import {ReactComponent as Sidebar} from '../../assets/sidebar.svg'
import {useAuth} from "../../model/auth/use-auth";

const Header = (props: { menuElements: HeaderMenuElement[] }) => {
    const [sidebarState, setSidebarState] = useState<"closed" | "opened">("closed")
    const {currentUser} = useAuth()
    const sidebarRef = useRef<HTMLDivElement>(null)

    const callbacks = {
        onSidebarClick: useCallback(() => {
            if (sidebarState === "closed") {
                if (sidebarRef.current) sidebarRef.current.style.display = "block"
                setTimeout(() => setSidebarState("opened"), 1)
            }
            if (sidebarState === "opened") setSidebarState("closed")
        }, [sidebarState]),
        onSidebarTransitionEnd: useCallback(() => {
            if(sidebarState === "closed" && sidebarRef.current) sidebarRef.current.style.display = "none"
        }, [sidebarState]),
        onResize: useCallback((event: any) => {
            if(sidebarRef.current && event.target.innerWidth > 750) {
                sidebarRef.current.style.display = ""
            } else if (sidebarRef.current && event.target.innerWidth <= 750) {
                sidebarRef.current.style.display = "none"
            }
        }, [])
    }
    const onSidebarOptionClicked = useCallback((menuElement: HeaderMenuElement) => {
        if(menuElement.action) {
            menuElement.action()
        }
        setSidebarState("closed")
    }, [])

    useEffect(() => {
        window.addEventListener("resize", callbacks.onResize)
        return () => window.removeEventListener("resize", callbacks.onResize)
    }, [callbacks.onResize])

    const buildHeaderElements = useMemo(() => {
        if(props.menuElements) {
            const availableElements = props.menuElements.filter((element) => {
                return element.accessLevel === 0 || currentUser.canAccess(element.accessLevel)
            })
            return availableElements.map((menuElement) => {
                const LiComponent = () => <li key={menuElement.menuName} className="header__menu__element">
                    {menuElement.menuName}
                </li>
                if (menuElement.menuRoute) {
                    return <NavLink
                        onClick={() => onSidebarOptionClicked(menuElement)}
                        key={menuElement.menuName}
                        className='nav_link'
                        to={menuElement.menuRoute}>
                        <LiComponent/>
                    </NavLink>
                } else {
                    return <div onClick={() => onSidebarOptionClicked(menuElement)}
                                key={menuElement.menuName}
                                className='nav_link'>
                        <LiComponent/>
                    </div>
                }
            })
        }

    }, [props.menuElements, currentUser, onSidebarOptionClicked])

    return (
        <div className="header__container">
            <menu className="header__content">
                <Link to='/'><img className="header__logo" src={logo} alt="Логотип"/></Link>
                <div className="header__elements" ref={sidebarRef} data-state={sidebarState} onTransitionEnd={callbacks.onSidebarTransitionEnd}>
                    {buildHeaderElements}
                </div>
                <div className="header__sidebar-icon" onClick={callbacks.onSidebarClick}>
                    <Sidebar className="header__sidebar-icon" onClick={callbacks.onSidebarClick}/>
                </div>
            </menu>
        </div>
    );
};

export default React.memo(Header);