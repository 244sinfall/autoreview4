import {PermissionTitleByValue} from "../../../model/user";
import * as Controllers from './controllers'
import Service from "../service";
import {UserController} from "./controllers/player";
export default class Controller extends Service {
    protected _controller: UserController = new UserController(this.services)
    protected _listeners: (<T extends UserController>(controller: T) => void)[] = []
    addListener(listener: <T extends UserController>(controller: T) => void) {
        this._listeners.push(listener)
        return () => this._listeners.filter(fn => fn !== listener)
    }
    getInstance() {
        return this._controller
    }
    initServicesConnection() {
        this.services.get("Store").getInstance().subscribe(() => {
            const state = this.services.get("Store").getInstance().getState()
            const controllerShouldBe = PermissionTitleByValue[state.user.user.permission]
            if(!(this._controller instanceof Controllers[controllerShouldBe])) {
                this._controller = new Controllers[controllerShouldBe](this.services);
                if(this._listeners.length > 0) {
                    this._listeners.forEach(listener => listener(this._controller))
                }
            }
        })
    }

}