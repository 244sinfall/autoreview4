import * as Services from './services/export'
import {FatalServicesInitException} from "../model/exceptions";

type IServicesModules = typeof Services

type IServices = {
    [K in keyof IServicesModules]: InstanceType<IServicesModules[K]>
}

type IServicesKeys = keyof IServices
export default class ServicesProvider {
    private readonly services: IServices
    private isCompleteServices(data: Partial<any>): data is IServices {
        let key: IServicesKeys
        for(key in Services) {
            if(!data[key]) return false;
        }
        return true;
    }
    constructor() {
        const bundlingServices: Partial<any> = {}
        let key: IServicesKeys
        for(key in Services) {
            bundlingServices[key] = new Services[key](this)
        }
        if(!this.isCompleteServices(bundlingServices))
            throw new FatalServicesInitException("Не удалось инициализировать сервисы", bundlingServices)
        this.services = bundlingServices;
    }

    get<T extends keyof IServices>(service: T): IServices[T] {
        return this.services[service]
    }
}