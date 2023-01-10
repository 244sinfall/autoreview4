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
            if(localStorage.getItem("hasFirebaseSession")) reject(new NotAuthorizedException("Не авторизован"))
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
            if(user) {
                this.user = user;
                localStorage.setItem("hasFirebaseSession", "true")
                this.services.get("Store").getInstance().dispatch(restoreSession(user))

            } else {
                this.user = null;
                localStorage.removeItem("hasFirebaseSession")
                this.services.get("Store").getInstance().dispatch(destroySession())
            }
        })
    }
}