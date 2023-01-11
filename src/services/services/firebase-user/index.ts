import Service from "../service";
import {onAuthStateChanged, User} from "firebase/auth";
import {auth} from "../../../model/auth/global";
import {NotAuthorizedException} from "../../../model/exceptions";
import {destroySession, restoreSession} from "../../../model/user/reducer";

export default class FirebaseUser extends Service {
    private user: User | null = null

    private async getUser() {
        if(this.user) return this.user
        return new Promise<User>((resolve, reject) => {
            if(!localStorage.getItem("hasFirebaseSession")) reject(new NotAuthorizedException("Не авторизован"))
            onAuthStateChanged(auth, user => {
                if(user) resolve(user)
            })
        })
    }

    public async getToken() {
        const user = await this.getUser()
        return await user.getIdToken();
    }
    public initServicesConnection() {
        onAuthStateChanged(auth, user => {
            let authTimeout: NodeJS.Timeout | undefined
            authTimeout = setTimeout(() => {
                if(localStorage.getItem("hasFirebaseSession")
                    && !this.services.get("Store").getInstance().getState().user.user.email) {
                    this.services.get("Store").getInstance().dispatch(destroySession())
                }
                }, 10000)


            if(user) {
                if(authTimeout) clearTimeout(authTimeout)
                this.user = user;
                this.services.get("Store").getInstance().dispatch(restoreSession(user))
            }
        })
    }
}