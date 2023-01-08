import {CheckResponse, CheckStatusValue, CheckTableParams, CheckTableParamsCompanion} from "./types";
import APIConfig from "../../../config/api";
import {Check} from "./check";

export class CheckProvider {
    private params: CheckTableParams = CheckTableParamsCompanion.default()
    private isApiResponseIsError(data: unknown): data is { error: string } {
        return typeof data === "object" && data !== null && "error" in data
    }
    private isApiResponseIsData(data: unknown): data is CheckResponse {
        return typeof data === "object" && data != null && "checks" in data
    }
    public async get(token: string | undefined): Promise<CheckResponse & { checks: Check[] }> {
        const response = await fetch(`${APIConfig.address}${APIConfig.endpoints.economics.getChecks}${this.parseParams()}`,
            {method: "GET", headers:{"Authorization": token ? token : ""}})
        const json: unknown = await response.json()
        if(this.isApiResponseIsError(json)) throw new Error(json.error)
        if(this.isApiResponseIsData(json)) {
            json.types = ["Все получатели", ...json.types.filter(t => t && t !== "-")]
            json.updatedAt = new Date(json.updatedAt)
            return Object.assign(json, {checks: json.checks.map(icheck => new Check(icheck))})
        }
        throw new Error("Неизвестный формат ответа. Обратитесь к администратору.")
    }
    setParams(params: CheckTableParams) {
        this.params = params;
    }
    private parseParams() {
        let delimiter = "&"
        let query = "?"
        for(let prop in this.params) {
            if(!CheckTableParamsCompanion.is(prop)) continue
            if(this.params[prop]) {
                if(prop === "status" && this.params[prop] === "Все") continue;
                if(prop === "category" && this.params[prop] === "Все получатели") continue;
                if(query.length !== 1) query += delimiter
                query += `${prop}=${String(prop === "status" ? CheckStatusValue[this.params[prop]] : this.params[prop])}`
            }
        }
        return query
    }
}