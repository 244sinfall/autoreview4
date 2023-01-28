import {PermissionTitle} from "../../../../model/user";
import * as Controllers from '../controllers'
import ServicesProvider from "../../../index";

export class UserController {
    constructor(protected services: ServicesProvider) {
    }
    is<T extends PermissionTitle>(key: T): this is InstanceType<typeof Controllers[T]> {
        return this instanceof Controllers[key]
    }
}