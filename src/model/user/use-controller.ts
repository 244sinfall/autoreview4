import * as Controllers from './controllers'
import {useAppSelector} from "../../services/services/store";
import {PermissionTitleByValue} from "./index";
import {useEffect, useState} from "react";
import {BaseController} from "./controllers/player";

export const useController = () => {
    const user = useAppSelector(state => state.user.user)
    const [controller, setController] = useState<BaseController>(new Controllers[PermissionTitleByValue[user.permission]]())
    useEffect(() => {
        setController(new Controllers[PermissionTitleByValue[user.permission]]())
    }, [user])

    return controller
}