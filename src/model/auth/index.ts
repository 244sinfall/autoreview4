import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User
} from 'firebase/auth'
import {initializeApp} from "firebase/app";
import {collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where} from 'firebase/firestore'
import {useEffect, useState} from "react";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {useAppDispatch, useAppSelector} from "../hooks";

export interface UserInfo {
    name: string,
    password: string,
    passwordCheck: string,
    email: string,
}

export enum AuthFields {
    name = "Ник на Darkmoon",
    password = "Пароль",
    passwordCheck = "Еще раз пароль",
    email= "E-mail",
}

const firebaseConfig = {
    apiKey: "AIzaSyCeWg8hD4-Qx4zKL0MyBr5w4ZBDfmufkhM",
    authDomain: "darkmoon-web-api.firebaseapp.com",
    projectId: "darkmoon-web-api",
    storageBucket: "darkmoon-web-api.appspot.com",
    messagingSenderId: "943722237832",
    appId: "1:943722237832:web:c8d4657e546ef27e52343d",
    measurementId: "G-J5N1VT8SKT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app)
const db = getFirestore(app)

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

enum Permission {
    player ,
    gm,
    admin,
}
export function getPermissionName(permission: Permission | null) {
    switch (permission) {
        case Permission.admin:
            return "Админ"
        case Permission.gm:
            return "ГМ"
        case Permission.player:
            return "Игрок"
        default:
            return "Не найдено"
    }
}

export function getPermissionValue(permission: string) {
    switch (permission) {
        case "Админ": return 2
        case "ГМ": return 1
        case "Игрок": return 0
        default: return 0
    }
}

export class AuthorizedUser {
    private _user: User
    private _permission: Permission | null
    constructor(user: User) {
        this._user = user
        this._permission = null
    }
    displayName() {
        return this._user.displayName
    }
    async getAllUsers() {
        if(this._permission && this._permission >= Permission.admin) {
            const fetched = await getDocs(query(collection(db, 'permissions')))
            return fetched.docs.map((d) => d.data())
        }
    }
    async changeRole(forEmail: string, to: Permission) {
        if(this._permission && this._permission >= Permission.admin) {
            try {
                const col = collection(db, 'permissions')
                const q = query(col, where('email', '==', forEmail))
                const result = await getDocs(q)
                const reference = result?.docs[0].ref
                await setDoc(reference, {permission: to}, {merge: true})
            } catch(e) {
                console.log(e)
            }

        }
    }
    permission() {
        return this._permission
    }
    canAccess(permission: Permission) {
        if(this._permission === null) return false
        return this._permission >= permission
    }
    isLoaded() {
        return this._permission !== null
    }
    async fetchPermission() {
        const document = await getDoc(doc(db, 'permissions', this._user.uid))
        const data = await document.data()
        this._permission = data?.permission as Permission ?? Permission.player
    }
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

interface UserState {
    user: AuthorizedUser | null
}

const userInitialState: UserState = {
    user: null
}

export const userSlice = createSlice({name: "user", initialState: userInitialState, reducers: {
        setUser: (state, action: PayloadAction<AuthorizedUser>) => {
            if(action.payload) state.user = action.payload
        },
        removeUser: (state) => {
            state.user = null
        }
    }})

