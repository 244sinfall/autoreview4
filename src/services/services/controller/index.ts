import {PermissionTitle, PermissionTitleByValue} from "../../../model/user";
import * as Controllers from './controllers'
import Service from "../service";
import {UserController} from "./controllers/player";
export default class Controller extends Service {
    protected _controller: UserController = new UserController()
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
                this._controller = new Controllers[controllerShouldBe]();
                if(this._listeners.length > 0) {
                    this._listeners.forEach(listener => listener(this._controller))
                }
            }
        })
    }

    getIf<T extends PermissionTitle>(permissionName: T): InstanceType<typeof Controllers[T]> | null {
        if(this._controller instanceof Controllers[permissionName]) {
            return this._controller as InstanceType<typeof Controllers[T]>
        }
        return null
    }
    isAbleToAccess<T extends PermissionTitle>(permissionName: T): boolean {
        return this._controller instanceof Controllers[permissionName]
    }
}