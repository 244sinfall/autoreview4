import {useAppDispatch, useAppSelector} from "../hooks";
import {useCallback, useEffect, useState} from "react";
import {onAuthStateChanged, signOut, User} from "firebase/auth";
import {auth} from "./global";
import {removeUser, setUser} from "./user/reducer";
import AuthorizedUser from "./user/authorized-user";
import Authorizer, {UserLoginCredentials, UserRegisterCredentials} from "./authorizer";

export const useAuth = () => {
    const currentUser = useAppSelector(state => state.user.user)
    const [isLoading, setIsLoading] = useState(!!localStorage.getItem("hasFirebaseSession") && !currentUser.authorized)
    const dispatch = useAppDispatch()
    const logout = useCallback(async() => {
        await signOut(auth)
        await dispatch(removeUser())
        localStorage.removeItem('hasFirebaseSession')
    }, [dispatch])
    const createSession = async(credentials: UserLoginCredentials | UserRegisterCredentials, formState: "reg" | "auth") => {
        const authorizer = new Authorizer(currentUser);
        const user = "passwordCheck" in credentials && formState === "reg"
            ? await authorizer.signup(credentials) : await authorizer.login(credentials)
        const authorizedUser = new AuthorizedUser(user);
        await authorizedUser.fetchPermission()
        dispatch(setUser(authorizedUser))
        localStorage.setItem("hasFirebaseSession", "true")
        return
    }
    const restoreSession = useCallback(async(user: User) => {
        const newUser = new AuthorizedUser(user)
        await newUser.fetchPermission()
        dispatch(setUser(newUser))
        localStorage.setItem("hasFirebaseSession", "true")
    }, [dispatch])

    useEffect(() => {
        if(isLoading) {
            const unsub = onAuthStateChanged(auth, user => {
                if (user && !currentUser.authorized)  {
                    restoreSession(user).then(() => setIsLoading(false))
                }
            })
            return () => unsub()
        }

    }, [currentUser, dispatch, isLoading, logout, restoreSession])
    return { isLoading, currentUser, logout, createSession }
}