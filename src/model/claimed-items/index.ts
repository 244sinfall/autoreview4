import {
    APIAddress,
    claimedItemsApproveEndPoint,
    claimedItemsCreateEndPoint,
    claimedItemsDeleteEndPoint,
    claimedItemsGetEndPoint,
    claimedItemsUpdateEndPoint
} from "../../config/api";
import {
    ClaimedItemsHTMLTableFooter,
    ClaimedItemsHTMLTableHeader,
    ClaimedItemsHTMLTableHeadLine
} from "./boilerplateMarkup";
import Visitor from "../auth/user";

export interface ClaimedItemsTables {
    legendary: ClaimedItemInterface[]
    epic: ClaimedItemInterface[]
    rare: ClaimedItemInterface[]
    green: ClaimedItemInterface[]
    other: ClaimedItemInterface[]
}

export interface ClaimedItemEditorChangeable {
    owner: string,
    ownerProfile: string,
    ownerProofLink: string,
}

export const ClaimedItemRequests = {
    add: async(i: ClaimedItem, currentUser: Visitor) => {
        const token = await currentUser.getToken()
        if (token) {
            return await fetch(`${APIAddress}${claimedItemsCreateEndPoint}`,
                {method: "POST", headers: {"Authorization": token}, body: JSON.stringify(i)})
        }
    },
    del: async(id: string, currentUser: Visitor) => {
        const token = await currentUser.getToken()
        if(token) {
            return await fetch(`${APIAddress}${claimedItemsDeleteEndPoint}/${id}`,
                {method: "DELETE", headers: {"Authorization": token}})
        }
    },
    update: async(id: string, changes: ClaimedItemEditorChangeable, currentUser: Visitor) => {
        const token = await currentUser.getToken()
        if(token) {
            return await fetch(`${APIAddress}${claimedItemsUpdateEndPoint}/${id}`,
                {method: "POST", headers: {"Authorization": token}, body: JSON.stringify(changes)})
        }
    },
    accept: async(id: string, currentUser: Visitor) => {
        const token = await currentUser.getToken()
        if(token) {
            return await fetch(`${APIAddress}${claimedItemsApproveEndPoint}/${id}`,
                {method: "POST", headers: {"Authorization": token}})
        }
    },
    get: async() => {
        const res = await fetch(`${APIAddress}${claimedItemsGetEndPoint}`)
        const json = await res.json()
        const rawItems = await json["result"] as ClaimedItemsTables
        return new ClaimedItemsTablesImpl(rawItems.epic, rawItems.green, rawItems.legendary, rawItems.other, rawItems.rare)
    }
}

export interface ClaimedItemEditHandler {
    close: () => void,
    update: (id: string, changes: any) => Promise<void>,
    accept: (id: string) => Promise<void>
    del: (id: string) => Promise<void>,
}
export interface ClaimedItemAddHandler {
    close: () => void,
    add: (i: ClaimedItem) => Promise<void>
}

export enum ClaimedItemsTablesOrder {
    legendary,
    epic,
    rare,
    green,
    other,
}

export class ClaimedItemsTablesImpl implements ClaimedItemsTables {
    epic: ClaimedItem[];
    green: ClaimedItem[];
    legendary: ClaimedItem[];
    other: ClaimedItem[];
    rare: ClaimedItem[];
    constructor(epic: ClaimedItemInterface[], green: ClaimedItemInterface[], legendary: ClaimedItemInterface[],
                other:ClaimedItemInterface[], rare: ClaimedItemInterface[]) {
        this.epic = epic.map(i => new ClaimedItem(i))
        this.green = green.map(i => new ClaimedItem(i))
        this.legendary = legendary.map(i => new ClaimedItem(i))
        this.other = other.map(i => new ClaimedItem(i))
        this.rare = rare.map(i => new ClaimedItem(i))
    }
    private generateTableHTMLHeader(prop: string) {
        let header = `<p style="text-align: center;"><span style="font-size: 14px;">Предметы `
        switch(prop){
            case "legendary": header += `<strong><span style="color: rgb(227, 108, 9);">легендарного </span></strong>`; break;
            case "epic": header += `<strong><span style="color: #8064a2;">эпического </span></strong>`; break;
            case "green": header += `<strong><span style="color: rgb(155, 187, 89);">необычного </span></strong>`; break;
            case "other": header += `<strong><span style="color: rgb(49, 133, 155);">прочего </span></strong>`; break;
            case "rare": header += `<strong><span style="color: rgb(31, 73, 125);">редкого </span></strong>`; break;
        }
        header += `качества<br></span></p>`
        return header

    }
    getTable(name: string) {
        if(this[name as keyof ClaimedItemsTables]) {
            return this[name as keyof ClaimedItemsTables]
        }
    }
    generateTableHTML() {
        let html: string = ClaimedItemsHTMLTableHeadLine
        for(let key of Object.keys(ClaimedItemsTablesOrder).filter(v => isNaN(Number(v)))) {
            const table = this.getTable(key)
            if(table) {
                html += this.generateTableHTMLHeader(key) + ClaimedItemsHTMLTableHeader
                for(let item of table) {
                    html += item.toHTMLTableRow()
                }
                html += ClaimedItemsHTMLTableFooter
            }
        }
        return html
    }
}

export function getClaimedItemsTitle(propName: string): string {
    switch (propName) {
        case "legendary": return "Предметы Легендарного качества"
        case "epic": return "Предметы Эпического качества"
        case "rare": return "Предметы Редкого качества"
        case "green": return "Предметы Необычного качества"
        case "other": return "Предметы Прочего качества"
        default: return "Предметы Прочего качества"
    }
}
export function getClaimedItemQuality(propName: string): string {
    switch (propName) {
        case "legendary": return "Легендарный"
        case "epic": return "Эпический"
        case "rare": return "Редкий"
        case "green": return "Необычный"
        case "other": return "Прочие"
        default: return "Прочие"
    }
}

export class ClaimedItem implements ClaimedItemInterface {
    id = ""
    quality = ""
    name = ""
    link = ""
    owner = ""
    ownerProfile = ""
    ownerProof = ""
    ownerProofLink = ""
    reviewer = ""
    accepted = false
    acceptor = ""
    addedAt: Date | null = new Date()
    acceptedAt = new Date()
    additionalInfo = ""
    constructor(obj?: ClaimedItemInterface, quality?: string, reviewer?: string) {
        if(obj) {
            Object.assign(this, obj)
            this.addedAt = obj.addedAt !== "0001-01-01T00:00:00Z" ? new Date(obj.addedAt as string) : null
            this.acceptedAt = new Date(obj.acceptedAt)
        }
        if(quality) this.quality = quality
        if(reviewer) this.reviewer = reviewer
    }
    toDisplay() {
        return { name: this.name, owner: this.owner, ownerProof: this.ownerProofLink, reviewer: this.reviewer, addedAt:
                this.addedAt ? this.addedAt.toLocaleString(): "", acceptor: this.acceptor,
            acceptedAt: this.accepted ? this.acceptedAt.toLocaleString() : "" }
    }
    toHTMLTableRow() {
        const ownerProof = this.ownerProofLink ? `<a href="${this.ownerProofLink}" target="_blank" rel="noreferrer"><span style="font-size: 14px;">${this.ownerProof}</span></a>` : `<p>-</p>`
        return `<tr>
\t<td><span style="font-size: 14px;"><a href="${this.link}" target="_blank">${this.name}</a></span>
\t</td>
\t<td>
\t\t<p>${this.owner}, ${this.ownerProfile}
\t\t</p>
\t</td>
\t<td>${ownerProof}
\t</td>
\t<td><span style="font-size: 14px;">${this.ownerProofLink.length > 1 ? "-" : "Согласован"}</span>
\t</td>
\t<td><span style="font-size: 14px;">${this.reviewer}</span>
\t</td>
</tr>`
    }
}

interface ClaimedItemInterface {
    id: string,
    quality: string,
    name: string,
    link: string,
    owner: string,
    ownerProfile: string,
    ownerProof: string,
    ownerProofLink: string,
    reviewer: string,
    accepted: boolean,
    acceptor: string,
    addedAt: string | Date | null,
    acceptedAt: string | Date,
    additionalInfo: string
}