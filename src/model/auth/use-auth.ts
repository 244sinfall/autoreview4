import {useAppDispatch, useAppSelector} from "../hooks";
import {useEffect, useState} from "react";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {auth} from "./global";
import {removeUser, setUser} from "./user/reducer";
import AuthorizedUser from "./user/authorized-user";

export const useAuth = () => {
    const currentUser = useAppSelector(state => state.user.user)
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useAppDispatch()
    const logout = () => {
        signOut(auth).finally(() => {
            dispatch(removeUser())
        })
    }
    useEffect(() => {
        if(!currentUser.authorized) {
            let timeout: NodeJS.Timeout
            const unsub = onAuthStateChanged(auth, user => {
                if (user) {
                    setIsLoading(true)
                    const newUser = new AuthorizedUser(user)
                    clearTimeout(timeout)
                    newUser.fetchPermission().then(() => {
                        dispatch(setUser(newUser))
                        setIsLoading(false)
                    })
                }
            })
            return () => unsub()
        } else if(currentUser.isLoaded()){
            setIsLoading(false)
        }

    }, [currentUser, dispatch])
    return { isLoading, currentUser, logout }
}