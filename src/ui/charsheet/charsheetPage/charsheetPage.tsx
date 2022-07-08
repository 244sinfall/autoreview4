import React from 'react';
import RateCounter from "../rateCounter/rateCounter";
import ReviewGenerator from "../reviewGenerator/reviewGenerator";
import './charsheetPage.css'

const CharsheetPage = () => {
    return (
        <div className="charsheetPage">
            <RateCounter rateNames={['Содержательность', 'Грамотность', 'Логичность', 'Каноничность']} rateMin={0} rateMax={10}/>
            <ReviewGenerator/>
        </div>
    );
};

export default CharsheetPage;