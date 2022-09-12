import React, { useState} from 'react';
import ContentTitle from "../../../components/static/content-title";
import ActionButton from "../../../components/static/action-button";
import {APIAddress, cleanLogEndPoint } from "../../../config/api";
import "./logCleaner.css"

function isFileOK(checkFile: File): string | null {
    if(!checkFile.name.endsWith(".txt")) {
        return "Неверный формат файла"
    }
    if(checkFile.size > 1e+8) {
        return "Слишком большой файл"
    }
    return null
}

const LogCleaner = () => {

    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [errMsg, setErrMsg] = useState<string | null>(null)
    async function cleanLog() {
        if(uploadedFile !== null) {
            const error = isFileOK(uploadedFile)
            if(error) {
                setErrMsg(error)
                return
            }
            let formData = new FormData()
            formData.append("input", uploadedFile)
            return await fetch(APIAddress + cleanLogEndPoint, {
                method: "POST",
                headers: {
                    "Accept": "application/octet-stream"
                },
                body: formData
            })
                .then((response) => {
                    if(response.status === 200) {
                        return response.blob()
                    }
                    else {
                        return response.json()
                    }
                })
                .then((jsonOrBlobResponse) => {
                    if(jsonOrBlobResponse["error"]) {
                        throw jsonOrBlobResponse
                    }
                    else {
                        let a = document.createElement("a")
                        a.href = window.URL.createObjectURL(jsonOrBlobResponse)
                        a.download = "output" + Date.now().toString() + ".txt"
                        a.click()
                    }
                })
                .catch((err) => {
                    setErrMsg(err["error"] ?? "Произошла неизвестная ошибка")
                })
        }
    }
    const rules =
        'Максимальный размер файла - 100 мегабайт.<br/><br/>' +
        'Очистка логов может занять до минуты в зависимости от скорости<br/>' +
        'вашего интернета. Если после очистки в файле все еще есть<br/>' +
        'нежелательные технические строки - обратитесь в ЛС'
    return (
        <div className="logCleaner">
            <ContentTitle title='Очистка логов'>
                <p className="logCleaner__cleanerContainer">Загрузите файл с логами (txt) для очистки от технических сообщений</p>
                <div className="logCleaner__cleanerContainer">
                    <label className="logCleaner__cleanerLabel" htmlFor="log">
                        {errMsg !== null ? errMsg : uploadedFile !== null ?
                        uploadedFile.name.substring(uploadedFile.name.lastIndexOf("\\")+1)
                        : "Нажмите, чтобы загрузить неочищенные логи"}
                        <input className="logCleaner__cleanerInput" id="log" type="file" name="uncleanedLog" accept=".txt" onChange={(e) => {
                            if (errMsg) {
                                setErrMsg(null)
                            }
                            if (e.target.files && e.target.files.length >= 1) {
                                setUploadedFile(e.target.files?.item(0))
                            }
                        }}/>
                    </label>
                    <ActionButton title={'Очистить логи'} show={uploadedFile !== null} action={cleanLog} tooltip={rules} requiresLoading={true}/>
                </div>
            </ContentTitle>
        </div>
    );
};

export default LogCleaner;