import React, {useMemo} from 'react';
import {PERMISSION, PermissionValue} from "../../model/auth/user";
import AccountManager from "../auth";
import ProtectorFrame from "../../components/protector/frame";
import ProtectorNoAccess from "../../components/protector/no-access/indei";
import {useAppSelector} from "../../model/hooks";

const Protector = (props: {children: React.ReactNode[] | React.ReactNode, accessLevel: PermissionValue}) => {
    const currentUser = useAppSelector(state => state.user.user)
    
    const protector = useMemo(() => {
        if(props.accessLevel === PERMISSION.Player) return
        if(!currentUser.authorized || !currentUser.isLoaded) {
            return <AccountManager />

        } else if(!currentUser.canAccess(props.accessLevel)) {
            return <ProtectorNoAccess/>
        }
        
    }, [currentUser,props.accessLevel])
    
    return (
        <>
            {protector && 
            <ProtectorFrame>
                {protector}
            </ProtectorFrame>}
            {!protector && props.children}
        </>
    );
};

export default Protector;