import Service from "../service";
import Config from './config'
import {APIResponseKnownError} from "../../../model/exceptions";

export default class API extends Service {
    protected config = Config

    /**
     *
     * @param endpoint Эндпоинт из конфигурации
     * @param params Query параметры
     * @param payload Тело запроса
     * @throws APIResponseKnownError
     */
    async createRequest<PayloadType extends BodyInit | void = void>(
                            endpoint: keyof typeof Config["endpoints"],
                            params: string = "",
                            payload?: PayloadType): Promise<Response> {

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
        const response = await fetch(`${Config.address}${Config.endpoints[endpoint].url}${params}`, init)
        if(!response.ok) throw new APIResponseKnownError(response)
        return response
    }
}