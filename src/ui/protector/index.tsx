import React, {useMemo} from 'react';
import {PERMISSION, PermissionValue} from "../../model/user";
import AccountManager from "../auth";
import ProtectorFrame from "../../components/protector/frame";
import ProtectorNoAccess from "../../components/protector/no-access/indei";
import {useAppSelector} from "../../services/services/store";

const Protector = (props: {children: React.ReactNode[] | React.ReactNode, accessLevel: PermissionValue}) => {
    const currentUser = useAppSelector(state => state.user.user)
    
    const protector = useMemo(() => {
        if(props.accessLevel === PERMISSION.Player) return
        if(!currentUser.email) {
            return <AccountManager />

        } else if(currentUser.permission < props.accessLevel) {
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