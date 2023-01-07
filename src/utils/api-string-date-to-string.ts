export default function apiStringDateToString(date: string | Date | null) {
    if(date === null) return "Неизвестно"
    if (typeof date === "object") {
        return date.toLocaleString()
    }
    return date === "0001-01-01T00:00:00Z" ? "Неизвестно" : new Date(date).toLocaleString()
}

