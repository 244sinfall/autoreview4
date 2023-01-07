import {APIConfig} from "../../config/api";
import ClaimedItemsHTMLParts from "./boilerplate";
import {
    ClaimedItemInterface, ClaimedItemMinimal,
    ClaimedItemsOperationsHandler,
    ClaimedItemsTables,
    ClaimedItemsTablesOrder
} from "./types";
import {auth} from "../auth/global";

export class ClaimedItemsNetworkProvider implements ClaimedItemsOperationsHandler {
    private async receiveToken() {
        if(!auth.currentUser) throw new Error("Пользователь не авторизован")
        const token = await auth.currentUser.getIdToken()
        if(!token) throw new Error("Токен не авторизован")
        return token
    }
    private resolve(response: Response) {
        if(response.ok) return
        throw new Error("Запрос вернул ошибку")
    }
    private isError(data: unknown): data is { error: string } {
        return typeof data === "object" && data !== null && "error" in data
    }
    private isResponse(data: unknown): data is { result: ClaimedItemsTables } {
        return typeof data === "object" && data !== null && "result" in data
    }
    private getClaimedItemTemplate(): ClaimedItemInterface {
        return {
            accepted: false,
            acceptedAt: new Date(),
            acceptor: "",
            addedAt: new Date(),
            additionalInfo: "",
            id: "",
            link: "",
            name: "",
            owner: "",
            ownerProfile: "",
            ownerProof: "",
            ownerProofLink: "",
            quality: "",
            reviewer: ""
        }
    }
    async get(): Promise<ClaimedItemsTables> {
        const res = await fetch(`${APIConfig.address}${APIConfig.endpoints.claimedItems.get}`)
        const json = await res.json()
        if(this.isError(json)) throw new Error(json.error)
        if(this.isResponse(json)) return json.result
        throw new Error("Некорректный ответ от сервера")
    }
    async accept(id: string): Promise<void> {
        const token = await this.receiveToken();
        const response = await fetch(`${APIConfig.address}${APIConfig.endpoints.claimedItems.approve}/${id}`,
            {method: "PATCH", headers: {"Authorization": token}})
        return this.resolve(response)
    }

    async add(item: Partial<ClaimedItemMinimal>): Promise<void> {
        const token = await this.receiveToken();
        const response = await fetch(`${APIConfig.address}${APIConfig.endpoints.claimedItems.create}`,
            {method: "POST", headers: {"Authorization": token}, body: JSON.stringify({...this.getClaimedItemTemplate(), ...item})})
        return this.resolve(response)
    }

    async del(id: string): Promise<void> {
        const token = await this.receiveToken();
        const response = await fetch(`${APIConfig.address}${APIConfig.endpoints.claimedItems.delete}/${id}`,
            {method: "DELETE", headers: {"Authorization": token}})
        return this.resolve(response)
    }

    async update(changes: ClaimedItemInterface): Promise<void> {
        const token = await this.receiveToken();
        const response = await fetch(`${APIConfig.address}${APIConfig.endpoints.claimedItems.update}/${changes.id}`,
            {method: "PUT", headers: {"Authorization": token}, body: JSON.stringify(changes)})
        return this.resolve(response)
    }
}

export class ClaimedItemsHTMLGenerator {
    private headers: Record<keyof ClaimedItemsTables, string> = {
        legendary: `<strong><span style="color: rgb(227, 108, 9);">легендарного </span></strong>`,
        epic: `<strong><span style="color: #8064a2;">эпического </span></strong>`,
        rare: `<strong><span style="color: rgb(31, 73, 125);">редкого </span></strong>`,
        green: `<strong><span style="color: rgb(155, 187, 89);">необычного </span></strong>`,
        other: `<strong><span style="color: rgb(49, 133, 155);">прочего </span></strong>`,
    }
    private constructHeaders(key: keyof ClaimedItemsTables) {
        return `<p style="text-align: center;"><span style="font-size: 14px;">Предметы ${this.headers[key]}качества<br></span></p>`
    }
    private generateItemHtml(item: ClaimedItemInterface) {
        const ownerProof = item.ownerProofLink ? `<a href="${item.ownerProofLink}" target="_blank" rel="noreferrer"><span style="font-size: 14px;">${item.ownerProof}</span></a>` : `<p>-</p>`
        return `<tr>
\t<td><span style="font-size: 14px;"><a href="${item.link}" target="_blank">${item.name}</a></span>
\t</td>
\t<td>
\t\t<p>${item.owner}, ${item.ownerProfile}
\t\t</p>
\t</td>
\t<td>${ownerProof}
\t</td>
\t<td><span style="font-size: 14px;">${item.ownerProofLink.length > 1 ? "-" : "Согласован"}</span>
\t</td>
\t<td><span style="font-size: 14px;">${item.reviewer}</span>
\t</td>
</tr>`
    }
    constructor(private tables: ClaimedItemsTables) {
    }

    generate() {
        let html = ClaimedItemsHTMLParts.headLine;
        Object.entries(this.tables).sort((a, b) => {
            const keyA = a[0] as keyof ClaimedItemsTables
            const keyB = b[0] as keyof ClaimedItemsTables
            return ClaimedItemsTablesOrder[keyA] < ClaimedItemsTablesOrder[keyB] ? -1 : 1
        })
            .map(entry => [entry[0] as keyof ClaimedItemsTables, entry[1] as ClaimedItemInterface[]] as const)
            .forEach(entry => {
                html += this.constructHeaders(entry[0]) + ClaimedItemsHTMLParts.header
                for(let item of entry[1]) {
                    html += this.generateItemHtml(item)
                }
                html += ClaimedItemsHTMLParts.footer
            })
        return html
    }
}

