import React from 'react';
import ChecksTable from "../checks-table";
import UpgradeCalculator from "../upgrade-calculator";
import LayoutBlock from "../../../components/common/layouts/block";
import LayoutGrid from "../../../components/common/layouts/grid";
import MoneyConverter from "../money-converter";

const EconomicsPage = () => {
    return (
        <LayoutBlock>
            <LayoutGrid templateColumns={"repeat(auto-fit, minmax(350px, 1fr))"}>
                <UpgradeCalculator/>
                <MoneyConverter/>
            </LayoutGrid>
            <ChecksTable/>
        </LayoutBlock>
    );
};

export default React.memo(EconomicsPage);