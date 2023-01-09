import React from 'react';
import TextCleaner from "../../common/participants-cleaner";
import LotteryCreator from "../lottery-creator";
import Protector from "../../protector";
import {PERMISSION} from "../../../model/user";
import {LayoutResponsiveGrid} from "../../../components/common/layouts/responsive-grid";



const EventsPage = () => {
    return (
        <Protector accessLevel={PERMISSION.Reviewer}>
            <LayoutResponsiveGrid gap={10} columns={[{minWidth: 620}, {minWidth: 330}]}>
                <TextCleaner/>
                <LotteryCreator/>
            </LayoutResponsiveGrid>
        </Protector>
    );
};

export default React.memo(EventsPage);