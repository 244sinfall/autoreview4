export const APIConfig = {
    address: process.env["REACT_APP_API_ADDRESS"],
    endpoints: {
        charsheets: {
            generate: process.env["REACT_APP_GEN_CHARSHEET_END_POINT"]
        },
        cleanLog: process.env["REACT_APP_CLEAN_LOG_END_POINT"],
        events: {
            cleanParticipants: process.env["REACT_APP_CLEAR_PARTICIPANTS_END_POINT"],
            createLottery: process.env["REACT_APP_CREATE_LOTTERY_END_POINT"],
        },
        arbiters: {
            rewardWork: process.env["REACT_APP_REWARDS_WORK_END_POINT"],
        },
        economics: {
            getChecks: process.env["REACT_APP_GET_CHECKS_END_POINT"],
        },
        claimedItems: {
            get: process.env["REACT_APP_GET_CLAIMED_ITEMS_END_POINT"],
            create: process.env["REACT_APP_CREATE_CLAIMED_ITEM_END_POINT"],
            delete: process.env["REACT_APP_DELETE_CLAIMED_ITEM_END_POINT"],
            update: process.env["REACT_APP_UPDATE_CLAIMED_ITEM_END_POINT"],
            approve: process.env["REACT_APP_APPROVE_CLAIMED_ITEM_END_POINT"]
        }
    }
} as const