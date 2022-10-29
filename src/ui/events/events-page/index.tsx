import React from 'react';
import TextCleaner from "../../common/participants-cleaner";
import LotteryCreator from "../lottery-creator";
import './style.css'
import Protector from "../../protector";
import {Permission} from "../../../model/auth/user";


const EventsPage = () => {
    return (
        <Protector accessLevel={Permission.reviewer}>
            <div className='events-page'>
                <TextCleaner/>
                <LotteryCreator/>
            </div>
        </Protector>
    );
};

export default EventsPage;