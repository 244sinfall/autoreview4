import Service from "../service";
import Config from './config'
import {APIResponseKnownError} from "../../../model/exceptions";

type ResponseTransform = "json" | "blob"
export default class API extends Service {
    protected config = Config
    private isAPIError(data: unknown): data is {error: string} {
        return typeof data === "object" && data !== null && "error" in data
    }
    async createRequest<PayloadType extends BodyInit | void = void>(
                            endpoint: keyof typeof Config["endpoints"], responseType: ResponseTransform,
                            payload?: PayloadType): Promise<unknown> {

        const init: RequestInit = {}
        init.headers = []
        init.method = Config.endpoints[endpoint].method
        if(Config.endpoints[endpoint].auth) {
            init.headers.push(["Authorization", await this.services.get("FirebaseUser").getToken()])
        }
        if(typeof payload === "object") {
            init.headers.push(["Content-Type", "application/json"])
        }
        init.headers.push(["Accept", Config.endpoints[endpoint].accept])
        if(payload) init.body = payload
        const response = await fetch(`${Config.address}${Config.endpoints[endpoint].url}`, init)
        if(!response.ok) throw new APIResponseKnownError(response.statusText)
        const responseData: unknown = await response[responseType]()
        if(responseType === "json") {
            if(this.isAPIError(responseData)) {
                throw new APIResponseKnownError(responseData.error)
            }
        }
         return responseData as ResponseType
    }
}