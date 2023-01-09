import React from 'react';
import Protector from "../../protector";
import UsersList from "../user-list";
import {PERMISSION} from "../../../model/user";
import {LayoutResponsiveGrid} from "../../../components/common/layouts/responsive-grid";

const AdminPage = () => {
    return (
        <Protector accessLevel={PERMISSION.Admin}>
            <LayoutResponsiveGrid gap={10} columns={[{}, {}]}>
                <UsersList/>
            </LayoutResponsiveGrid>
        </Protector>
    );
};

export default React.memo(AdminPage);