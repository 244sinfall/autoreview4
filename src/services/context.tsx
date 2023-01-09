import React from "react";
import ServicesProvider from "./index";

export const ServicesContext = React.createContext<ServicesProvider | {}>({})

interface ServicesProviderProps {
    services: ServicesProvider
    children: React.ReactNode | React.ReactNode[]
}

export default function ServicesProviderContext(props: ServicesProviderProps) {
    return (
        <ServicesContext.Provider value={props.services}>
            {props.children}
        </ServicesContext.Provider>
    )
}