import React from 'react';
import TextCleaner from "../../common/participants-cleaner";
import EventRewardGiver from "../event-reward-distributor";
import './style.css';
import Protector from "../../protector";
import BusinessRewarder from "../business-rewarder";

const ArbitersPage = () => {
    return (
            <Protector accessLevel={1}>
                <div className="arbiters-page">
                    <div className="arbiters-page__contents">
                        <TextCleaner/>
                        <EventRewardGiver/>
                        <BusinessRewarder/>
                    </div>
                </div>
            </Protector>

    );
};

export default ArbitersPage;