import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {useEffect, useState} from "react";
import {UserInfo} from "../user/model";
import {auth, db} from "../global";
import {userSlice} from "../user/reducer";
import {AuthorizedUser} from "../user";

export const handleLogin = async(user: UserInfo) => {
    if(!user.password || !user.email || !user.email.includes("@")) throw Error("Не все поля заполнены")
    const { email, password } = user
    return await signInWithEmailAndPassword(auth, email, password)
}

export const handleSignUp = async(user: UserInfo) => {
    if(user.password !== user.passwordCheck) throw Error("Пароли не совпадают")
    if(!user.password || !user.email || !user.name) throw Error("Не все поля заполнены")
    const { email, password } = user
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, {displayName: user.name})
    await setDoc(doc(db, 'permissions', result.user.uid), {
        email: result.user.email,
        permission: 0
    })
}

export const useAuth = () => {
    const currentUser = useAppSelector(state => state.user.user)
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useAppDispatch()
    const logout = () => {
        signOut(auth).finally(() => {
            dispatch(userSlice.actions.removeUser())
        })
    }
    useEffect(() => {
        if(!currentUser) {
            let timeout: NodeJS.Timeout
            const unsub = onAuthStateChanged(auth, user => {
                if (user) {
                    setIsLoading(true)
                    const newUser = new AuthorizedUser(user)
                    clearTimeout(timeout)
                    newUser.fetchPermission().then(() => {
                        dispatch(userSlice.actions.setUser(newUser))
                        setIsLoading(false)
                    })
                }
            })
            return () => unsub()
        } else if(currentUser && currentUser.isLoaded()){
            setIsLoading(false)
        }

    }, [currentUser, dispatch])
    return { isLoading, currentUser, logout }
}