import React, {useCallback, useState} from 'react';
import APIConfig from "../../../config/api";
import FileLogCleaner from "../../../components/other/log-cleaner";

const LogCleaner = () => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)

    const [errMsg, setErrMsg] = useState("")

    const callbacks = {
        onFileChange: useCallback((newFile: File) => setUploadedFile(newFile), []),
        onTrigger: useCallback(async() => {
            if(!uploadedFile) return setErrMsg("Файл не загружен!")
            if(!uploadedFile.name.endsWith('.txt')) return setErrMsg("Неверный формат файла!")
            if(uploadedFile.size > 1e+8) return setErrMsg("Файл слишком большой!")
            const dataTransfer = new FormData();
            dataTransfer.append('input', uploadedFile);
            const response = await fetch(`${APIConfig.address}${APIConfig.endpoints.cleanLog}`, {
                method: "POST",
                headers: {
                    "Accept": "application/octet-stream"
                },
                body: dataTransfer
            })
            if(!response.ok) return setErrMsg("Ошибка в ответе от сервера. Обратитесь к администратору!")
            const blob = await response.blob();
            let a = document.createElement("a")
            a.href = window.URL.createObjectURL(blob)
            a.download = "output" + Date.now().toString() + ".txt"
            a.click()
        }, [uploadedFile])
    }

    return (
        <FileLogCleaner onNewFile={callbacks.onFileChange}
                        isTriggerDisabled={!uploadedFile}
                        onTrigger={callbacks.onTrigger}
                        label={errMsg || uploadedFile?.name || "Нажмите, чтобы загрузить неочищенные логи"}/>
    );
};

export default LogCleaner;