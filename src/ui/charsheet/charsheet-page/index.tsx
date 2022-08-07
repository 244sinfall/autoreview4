import React from 'react';
import CharsheetReviewRateCounter from "../rate-counter";
import CharsheetReviewGenerator from "../review-generator";
import './style.css'

const CharsheetPage = () => {
    return (
        <div className="charsheet-page">
            <CharsheetReviewRateCounter rateNames={['Содержательность', 'Грамотность', 'Логичность', 'Каноничность']} rateMin={0} rateMax={10}/>
            <CharsheetReviewGenerator/>
        </div>
    );
};

export default CharsheetPage;