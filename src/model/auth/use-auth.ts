import {useAppDispatch, useAppSelector} from "../../services/services/store";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./global";
import {restoreSession} from "../user/reducer";

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const select = useAppSelector(state => state.user)
    onAuthStateChanged(auth, user => {
        if(user && select.isLoading) {
            dispatch(restoreSession(user))
        }
    })

}
