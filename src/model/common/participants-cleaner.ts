import {APIConfig} from "../../config/api";

export interface ParticipantsCleanerRequest {
    rawText: string
}

export interface ParticipantsCleanerResponse {
    cleanedText: string,
    editedLines: string,
    cleanedCount: number
}

export async function cleanParticipantsText(request: ParticipantsCleanerRequest) {
    if(!request.rawText) throw Error("Пустой запрос")
    return await fetch(`${APIConfig.address}${APIConfig.endpoints.events.cleanParticipants}`, {
            method: "POST",
            headers: {
                "Accept": "application/octet-stream"
            },
            body: JSON.stringify(request)
            })
            .then((response) => response.json())
            .then((json) => {
                if(json['error']) throw Error(json['error'])
                return json as ParticipantsCleanerResponse
            })
}
