import React from 'react';
import TextCleaner from "../../common/participants-cleaner";
import LotteryCreator from "../lottery-creator";
import './style.css'
import Protector from "../../protector";


const EventsPage = () => {

    return (
        <Protector accessLevel={1}>
            <div className='events-page'>
                <TextCleaner/>
                <LotteryCreator/>
            </div>
        </Protector>

    );
};

export default EventsPage;