import React from 'react';
import CharsheetReviewRateCounter from "../rate-counter";
import CharsheetReviewGenerator from "../review-generator";
import './style.css'
import Protector from "../../protector";
import {Permission} from "../../../model/auth/user";

const CharsheetPage = () => {
    return (
        <Protector accessLevel={Permission.reviewer}>
            <div className="charsheet-page">
                <CharsheetReviewRateCounter
                    rateNames={['Содержательность', 'Грамотность', 'Логичность', 'Каноничность']}
                    rateMin={0} rateMax={10}/>
                <CharsheetReviewGenerator/>
           </div>
        </Protector>
    );
};

export default CharsheetPage;