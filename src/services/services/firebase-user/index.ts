import Service from "../service";
import {onAuthStateChanged, User} from "firebase/auth";
import {auth} from "../../../model/auth/global";
import {NotAuthorizedException} from "../../../model/exceptions";
import ServicesProvider from "../../index";

export default class FirebaseUser extends Service {
    private user: User | null = null

    constructor(protected services: ServicesProvider) {
        super(services);
        onAuthStateChanged(auth, user => {
            if(user) {
                this.user = user;
                localStorage.setItem("hasFirebaseSession", "true")
            } else {
                this.user = null;
                localStorage.removeItem("hasFirebaseSession")
            }
        })
    }
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
}