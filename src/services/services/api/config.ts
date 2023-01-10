const APIConfig = {
    address: process.env["REACT_APP_API_ADDRESS"],
    endpoints: {
        "charReview.generate": {
            url: '/generate_charsheet_review',
            method: "POST",
            auth: false,
            accept: "application/json"
        },
        "cleanLog": {
            url: '/clean_log',
            method: "POST",
            auth: false,
            accept: "application/octet-stream"

        },
        "events.cleanParticipants": {
            url: '/events/clean_participants_text',
            method: 'POST',
            auth: false,
            accept: "application/json"
        },
        "events.createLottery": {
            url: '/events/create_lottery',
            method: "POST",
            auth: false,
            accept: "application/json"
        },
        "arbiters.rewardWork": {
            url: '/arbiters/rewards_work',
            method: "POST",
            auth: false,
            accept: "application/json"
        },
        "checks.get": {
            url: '/economics/get_checks',
            method: "GET",
            auth: true,
            accept: "application/json"
        },
        "claimedItems.get": {
            url: '/claimed_items/get_items',
            method: "GET",
            auth: false,
            accept: "application/json"
        },
        "claimedItems.create": {
            url: '/claimed_items/create',
            method: "POST",
            auth: true,
            accept: "application/json"
        },
        "claimedItems.delete": {
            url: '/claimed_items/delete',
            method: "DELETE",
            auth: true,
            accept: "application/json"
        },
        "claimedItems.update": {
            url: '/claimed_items/update',
            method: "PUT",
            auth: true,
            accept: "application/json"
        },
        "claimedItems.approve": {
            url: '/claimed_items/approve',
            method: "PATCH",
            auth: true,
            accept: "application/json"
        }
    }
} as const

export default APIConfig