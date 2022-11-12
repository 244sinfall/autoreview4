import React from 'react';
import TextCleaner from "../../common/participants-cleaner";
import EventRewardGiver from "../event-reward-distributor";
import './style.css';
import Protector from "../../protector";
import BusinessRewarder from "../business-rewarder";
import {Permission} from "../../../model/auth/user";

const ArbitersPage = () => {
    return (
            <Protector accessLevel={Permission.arbiter}>
                <div className="arbiters-page">
                    <div className="arbiters-page__contents">
                        <div className="arbiters-page__contents-left">
                            <TextCleaner/>
                            <BusinessRewarder/>
                        </div>
                        <EventRewardGiver/>

                    </div>
                </div>
            </Protector>

    );
};

export default ArbitersPage;