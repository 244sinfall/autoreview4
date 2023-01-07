import React, {useMemo} from 'react';
import {useAuth} from "../../model/auth/use-auth";
import {PermissionValue} from "../../model/auth/user";
import AccountManager from "../auth";
import ProtectorFrame from "../../components/protector/frame";
import ProtectorNoAccess from "../../components/protector/no-access/indei";

const Protector = (props: {children: React.ReactNode[] | React.ReactNode, accessLevel: PermissionValue}) => {
    const {currentUser, isLoading} = useAuth()
    
    const protector = useMemo(() => {
        if(isLoading || !currentUser.authorized) {
            return <AccountManager />

        } else if(!currentUser.canAccess(props.accessLevel)) {
            return <ProtectorNoAccess/>
        }
        
    }, [currentUser, isLoading, props.accessLevel])
    
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