const APIConfig = {
    address: process.env["REACT_APP_API_ADDRESS"],
    endpoints: {
        charsheets: {
            generate: '/generate_charsheet_review'
        },
        cleanLog: '/clean_log',
        events: {
            cleanParticipants: '/events/clean_participants_text',
            createLottery: '/events/create_lottery',
        },
        arbiters: {
            rewardWork: '/arbiters/rewards_work',
        },
        economics: {
            getChecks: '/economics/get_checks',
        },
        claimedItems: {
            get: '/claimed_items/get_items',
            create: '/claimed_items/create',
            delete: '/claimed_items/delete',
            update: '/claimed_items/update',
            approve: '/claimed_items/approve'
        }
    }
} as const

export default APIConfig