import React from 'react';
import LogCleaner from "../log-cleaner";
import {LayoutResponsiveGrid} from "../../../components/common/layouts/responsive-grid";

const OtherPage = () => {
    return (
        <LayoutResponsiveGrid gap={10} columns={[{}]}>
            <LogCleaner/>
        </LayoutResponsiveGrid>
    );
};

export default OtherPage;