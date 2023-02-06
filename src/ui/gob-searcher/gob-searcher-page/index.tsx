import React from 'react';
import Protector from "../../protector";
import {PERMISSION} from "../../../model/user";
import GobSearcher from "../gob-searcher";

const GobSearcherPage = () => {
    return (
        <Protector accessLevel={PERMISSION.GM}>
            <GobSearcher/>
        </Protector>
    );
};

export default GobSearcherPage;