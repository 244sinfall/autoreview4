import React from 'react';
import TextCleaner from "../../common/participants-cleaner";
import LotteryCreator from "../lottery-creator";
import './style.css'


const EventsPage = () => {
    return (
        <div className='events-page'>
            <TextCleaner/>
            <LotteryCreator/>
        </div>
    );
};

export default EventsPage;