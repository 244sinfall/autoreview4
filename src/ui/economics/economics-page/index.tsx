import React from 'react';
import ChecksTable from "../checks-table";
import UpgradeCalculator from "../upgrade-calculator";
import LayoutBlock from "../../../components/layouts/block";

const EconomicsPage = () => {
    return (
        <LayoutBlock>
            <UpgradeCalculator/>
            <ChecksTable/>
        </LayoutBlock>
    );
};

export default React.memo(EconomicsPage);