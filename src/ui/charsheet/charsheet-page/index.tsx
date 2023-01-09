import React from 'react';
import CharsheetReviewRateCounter from "../rate-counter";
import CharsheetReviewGenerator from "../review-generator";
import Protector from "../../protector";
import {PERMISSION} from "../../../model/user";
import {LayoutResponsiveGrid} from "../../../components/common/layouts/responsive-grid";

const CharsheetPage = () => {
    return (
        <Protector accessLevel={PERMISSION.Reviewer}>
            <LayoutResponsiveGrid gap={10} columns={[{maxWidth: 350}, {}]}>
                <CharsheetReviewRateCounter
                    rateMin={0} rateMax={10}/>
                <CharsheetReviewGenerator/>
           </LayoutResponsiveGrid>
        </Protector>
    );
};

export default React.memo(CharsheetPage);