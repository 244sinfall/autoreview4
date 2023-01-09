import {PermissionTitle} from "../index";
import * as Controllers from '../controllers'
export class BaseController {
    is<T extends PermissionTitle>(permissionName: T): this is InstanceType<typeof Controllers[T]> {
        return this instanceof Controllers[permissionName]
    }
}