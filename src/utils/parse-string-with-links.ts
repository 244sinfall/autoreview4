
export function parseStringWithLinks(str: string) {
    const regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
    let link = str
    const wowheadPossibleItem = /item=[0-9]+\//
    if(wowheadPossibleItem.test(str)) {
        const exec = wowheadPossibleItem.exec(str)!
        link = str.substring(0, exec.index + exec[0].length)
    }
    return str.replace(regex, (old) => {
        return `<a class='generated-link' href="${old}" target='_blank' rel='norefferer'>${link}</a>`
    })
}
