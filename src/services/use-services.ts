import {useContext} from "react";
import {ServicesContext} from "./context";
import ServicesProvider from "./index";

export default function useServices() {
    return useContext(ServicesContext) as ServicesProvider
}