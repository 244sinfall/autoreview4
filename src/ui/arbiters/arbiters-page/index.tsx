import React from 'react';
import TextCleaner from "../../common/participants-cleaner";
import RewardWorkerComponent from "../reward-worker";
import './style.css';
import Protector from "../../protector";
import BusinessRewarder from "../business-rewarder";

const ArbitersPage = () => {
    return (
            <Protector accessLevel={1}>
                <div className="arbiters-page">
                    <div className="arbiters-page__contents">
                        <TextCleaner/>
                        <RewardWorkerComponent/>
                        <BusinessRewarder/>
                    </div>
                </div>
            </Protector>

    );
};

export default ArbitersPage;