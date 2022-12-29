import React from 'react';
import ChecksTable from "../checks-table";
import UpgradeCalculator from "../upgrade-calculator";
import LayoutBlock from "../../../components/common/layouts/block";
import MoneyConverter from "../money-converter";
import {LayoutResponsiveGrid} from "../../../components/common/layouts/responsive-grid";

const EconomicsPage = () => {
    return (
        <LayoutBlock>
            <LayoutResponsiveGrid gap={10} columns={[{minWidth: 480}, {maxWidth: 370}]}>
                <UpgradeCalculator/>
                <MoneyConverter/>
            </LayoutResponsiveGrid>
            <ChecksTable/>
        </LayoutBlock>
    );
};

export default React.memo(EconomicsPage);