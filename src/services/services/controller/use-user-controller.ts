import useServices from "../../use-services";
import {useEffect, useState} from "react";
import {useAppSelector} from "../store";

export default function useUserController() {
    const service = useServices().get("UserController")
    const [controller, setController] = useState(service.getInstance());
    const user = useAppSelector(state => state.user.user)
    useEffect(() => {
        const unsub = service.addListener(controller => setController(controller))
        return () => {
            unsub()
        }
    }, [service, user])
    return controller
}