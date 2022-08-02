import React from 'react';
import TextCleaner from "../../events/textCleaner/textCleaner";
import RewardWorkerComponent from "../rewardWorker/rewardWorker";
import './arbitersPage.css';

const ArbitersPage = () => {
    return (
        <div className="arbitersPage">
            <div className="arbitersPage__textCleanerRewardWorker">
                <TextCleaner/>
                <RewardWorkerComponent/>
            </div>
        </div>
    );
};

export default ArbitersPage;