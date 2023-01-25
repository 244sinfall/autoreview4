import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import BusinessRewardDefaultState, {BusinessRewardInfo, BusinessRewardPerLabor} from "./types";
import Resources from './resources'

const businessRewardSlice = createSlice({
    name: "business-rewards",
    initialState: BusinessRewardDefaultState,
    reducers: {
        setFields: (state, action: PayloadAction<BusinessRewardInfo>) => {
            state.info = action.payload
        },
        setCommand: state => {
            if(!state.info.labors || !state.info.poiLevel || !state.info.resource || !state.info.owner || !state.info.multiplier) {
                state.error = "Поля не заполнены"
                return
            }
            const finalMod = state.info.multiplier * state.info.labors
            const resource = Resources.find(resource => resource.id === state.info.resource)
            if(!resource)
                state.error = "Выбран некорректный ресурс"
            else if(resource.id === 0)
                state.error = "Не выбран ресурс"
            else switch(resource.type) {
                case "Gold": state.command = `.send mo ${state.info.owner} "Предприятие" ` +
                    `"${state.info.poi}" ${Math.round(finalMod * BusinessRewardPerLabor["Gold"][state.info.poiLevel] ?? 0)}`; break;
                case "Second":
                case "First": state.command = `.send it ${state.info.owner} "Предприятие" ` +
                    `"${state.info.poi}" ${state.info.resource}:${Math.ceil(finalMod * BusinessRewardPerLabor[resource.type][state.info.poiLevel])}`; break
            }
            state.error = ""
        }
    },
})

export default businessRewardSlice.reducer

export const { setCommand, setFields } = businessRewardSlice.actions