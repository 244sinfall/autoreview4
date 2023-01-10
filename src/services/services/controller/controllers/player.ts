import {PermissionTitle} from "../../../../model/user";
import * as Controllers from '../controllers'

export class UserController {
    is<T extends PermissionTitle>(key: T): this is InstanceType<typeof Controllers[T]> {
        return this instanceof Controllers[key]
    }
}