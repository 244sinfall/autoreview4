import ServicesProvider from "../index";

export default class Service {
    constructor(protected services: ServicesProvider) {
    }

    /**
     * Метод для установки соединения / слушателей между сервисами
     */
    initServicesConnection() {
    }
}