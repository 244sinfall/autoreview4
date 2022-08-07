import React from 'react';
import TextCleaner from "../../common/participants-cleaner";
import RewardWorkerComponent from "../reward-worker";
import './style.css';

const ArbitersPage = () => {
    return (
        <div className="arbiters-page">
            <div className="arbiters-page__contents">
                <TextCleaner/>
                <RewardWorkerComponent/>
            </div>
        </div>
    );
};

export default ArbitersPage;