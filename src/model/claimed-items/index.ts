import {AuthorizedUser} from "../auth/firebase/user";
import {
    APIAddress,
    claimedItemsApproveEndPoint,
    claimedItemsCreateEndPoint,
    claimedItemsDeleteEndPoint,
    claimedItemsGetEndPoint,
    claimedItemsUpdateEndPoint
} from "../../config/api";

export interface ClaimedItemsTablesClasses {
    legendary: ClaimedItem[]
    epic: ClaimedItem[]
    rare: ClaimedItem[]
    green: ClaimedItem[]
    other: ClaimedItem[]
}

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
    add: async(i: ClaimedItem, currentUser: AuthorizedUser | null) => {
        const token = await currentUser?.getToken()
        if (token) {
            return await fetch(`${APIAddress}${claimedItemsCreateEndPoint}`,
                {method: "POST", headers: {"Authorization": token}, body: JSON.stringify(i)})
        }
    },
    del: async(id: string, currentUser: AuthorizedUser | null) => {
        const token = await currentUser?.getToken()
        if(token) {
            return await fetch(`${APIAddress}${claimedItemsDeleteEndPoint}/${id}`,
                {method: "DELETE", headers: {"Authorization": token}})
        }
    },
    update: async(id: string, changes: ClaimedItemEditorChangeable, currentUser: AuthorizedUser | null) => {
        const token = await currentUser?.getToken()
        if(token) {
            return await fetch(`${APIAddress}${claimedItemsUpdateEndPoint}/${id}`,
                {method: "POST", headers: {"Authorization": token}, body: JSON.stringify(changes)})
        }
    },
    accept: async(id: string, currentUser: AuthorizedUser | null) => {
        const token = await currentUser?.getToken()
        if(token) {
            return await fetch(`${APIAddress}${claimedItemsApproveEndPoint}/${id}`,
                {method: "POST", headers: {"Authorization": token}})
        }
    }
}



export function getClaimedItemsTitle(propName: string): string {
    switch (propName) {
        case "legendary": return "Предметы Легендарного качества"
        case "epic": return "Предметы Эпического качества"
        case "rare": return "Предметы Редкого качества"
        case "green": return "Предметы Необычного качества"
        case "other": return "Предметы Прочего качества"
        default: return "Предметы Прочьего качества"
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

export class ClaimedItem {
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
            this.addedAt = obj.addedAt !== "0001-01-01T00:00:00Z" ? new Date(obj.addedAt) : null
            this.acceptedAt = new Date(obj.acceptedAt)
        }
        if(quality) this.quality = quality
        if(reviewer) this.reviewer = reviewer
    }
    toDisplay() {
        return { name: this.name, owner: this.owner, ownerProof: this.ownerProofLink, reviewer: this.reviewer, addedAt: this.addedAt ? this.addedAt.toLocaleString(): "", acceptor: this.acceptor, acceptedAt: this.accepted ? this.acceptedAt.toLocaleString() : "" }
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

export interface ClaimedItemInterface {
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
    addedAt: string,
    acceptedAt: string,
    additionalInfo: string
}

export function generateTableHTML(tables: ClaimedItemsTablesClasses) {
    const tableFooter = `</tbody></table><br/>`
    const tableHeader = `<table>
<tbody>
<tr>
    <td><span style="font-size: 14px;"><strong>Наименование предмета,<br>ссылка</strong></span>
</td>
<td><span style="font-size: 14px;"><strong>Имя персонажа-владельца предмета, профиль</strong></span>
</td>
<td><span style="font-size: 14px;"><strong>Подтверждение владения предметом
</strong></span>
</td>
<td><span style="font-size: 14px;"><strong>Подтверждения нет, начат сюжет получения предмета
</strong></span>
</td>
<td><span style="font-size: 14px;"><strong>Кто и когда согласовал получение предмета</strong>
</span>
</td>
</tr>`
    let html: string = `<p style="text-align: center;" rel="text-align: center;"><span style="font-size: 14px;"><strong>Таблица именных предметов</strong>
</span>
</p>
<hr>`
    if(tables.legendary) {
        html += `<p style="text-align: center;"><span style="font-size: 14px;">Предметы <strong><span style="color: rgb(227, 108, 9);">легендарного </span></strong>качества<br>
</span>
</p>`
        html += tableHeader
        tables.legendary.forEach(i => {
            html += i.toHTMLTableRow()
        })
        html += tableFooter
    }
    if(tables.epic) {
        html += `<p style="text-align: center;"><span style="font-size: 14px;">Предметы <strong><span style="color: #8064a2;">эпического </span></strong>качества<span style="color: #7f6000;"></span>
</span>
</p>`
        html += tableHeader
        tables.epic.forEach(i => {
            html += i.toHTMLTableRow()
        })
        html += tableFooter
    }
    if(tables.rare) {
        html += `<p style="text-align: center;"><span style="font-size: 14px;">Предметы <strong><span style="color: rgb(31, 73, 125);"></span><span style="color: rgb(31, 73, 125);">редкого</span> </strong>качества<span style="color: #7f6000;"></span>
</span>
</p>`
        html += tableHeader
        tables.rare.forEach(i => {
            html += i.toHTMLTableRow()
        })
        html += tableFooter
    }
    if(tables.green) {
        html += `<p style="text-align: center;"><span style="font-size: 14px;">Предметы <strong><span style="color: rgb(155, 187, 89);"></span><span style="color: rgb(155, 187, 89);">необычного</span> </strong>качества<span style="color: #7f6000;"></span>
</span>
</p>`
        html += tableHeader
        tables.green.forEach(i => {
            html += i.toHTMLTableRow()
        })
        html += tableFooter
    }
    if(tables.other) {
        html += `<p style="text-align: center;"><span style="font-size: 14px;">Предметы <strong><span style="color: rgb(49, 133, 155);">прочего </span></strong><strong><span style="color: #8064a2;"> </span></strong>качества<span style="color: #7f6000;"></span>
</span>
</p>`
        html += tableHeader
        tables.other.forEach(i => {
            html += i.toHTMLTableRow()
        })
        html += tableFooter
    }
    return html
}


export const receiveItems = async() => {
    const res = await fetch(`${APIAddress}${claimedItemsGetEndPoint}`)
    const json = await res.json()
    const rawItems = await json["result"] as ClaimedItemsTables
    return Object.fromEntries(Object.entries(rawItems).map(v => {
        return [v[0], (v[1] as ClaimedItemInterface[]).map(i => new ClaimedItem(i))]
    })) as unknown as ClaimedItemsTablesClasses
}