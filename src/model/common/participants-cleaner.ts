import {APIConfig} from "../../config/api";

export interface ParticipantsCleanerResponse {
    cleanedText: string,
    editedLines: string,
    cleanedCount: number
}

function isResponse(json: unknown): json is ParticipantsCleanerResponse {
    return typeof json === "object" && json != null && "cleanedText" in json && "editedLines" in json && "cleanedCount" in json;
}

export async function cleanParticipantsText(rawText: string) {
    if(!rawText) throw Error("Пустой запрос")
    const response = await fetch(`${APIConfig.address}${APIConfig.endpoints.events.cleanParticipants}`, {
            method: "POST",
            headers: {
                "Accept": "application/octet-stream"
            },
            body: JSON.stringify({rawText: rawText})
            })
    const json: unknown = await response.json()
    if(isResponse(json)) return json;
    throw new Error("Непонятный формат ответа");
}
