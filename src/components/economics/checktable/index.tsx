import React from 'react';
import ContentTitle from "../../common/content-title";
import CheckTable from "./table";
import CheckTableFilters from "./filter";
import CheckTableInfo from "./info";
import {CheckResponse, CheckTableParams} from "../../../model/economics/checks/types";
import {Check} from "../../../model/economics/checks/check";
import CheckTableModal from "./modal";
import './styles.css'


type CheckTableWrapperProps = {
    isLoading: boolean
    modal?: {
        check: Check
        onClose: () => void
    }
    response: CheckResponse & {checks: Check[]} | null
    params: CheckTableParams
    onParamsChange: <K extends keyof CheckTableParams, V extends CheckTableParams[K]>(key: K, newParam: V) => void
    error?: string
    isUserAbleToForce: boolean,
    onForce: () => Promise<void>
    renderCheck: (check: Check) => JSX.Element
}
const CheckTableWrapper = (props: CheckTableWrapperProps) => {
    return (
        <ContentTitle className="check-table" title={"Экономические чеки"} collapsable={false}>
            <div className="check-table-top">
                <CheckTableFilters searchOnChange={newSearch => props.onParamsChange("search", newSearch)}
                                   showAmountOnChange={newShowAmount => props.onParamsChange("limit", newShowAmount)}
                                   showAmount={props.params.limit}
                                   statusFilterOnChange={newFilter => props.onParamsChange("status", newFilter)}
                                   statusFilterValue={props.params.status}
                                   typeSelectOnChange={newSelect => props.onParamsChange("category", newSelect)}
                                   typeSelectValues={props.response?.types ?? []}/>
                {props.error && <p className="check-table-error">{props.error}</p>}
                <CheckTableInfo checkCount={props.response?.count ?? 0}
                            filteredCheckCount={props.response?.filteredCount ?? 0}
                            actualDate={props.response?.updatedAt ?? new Date()}
                            isUserAbleToForceUpdate={props.isUserAbleToForce}
                            onForce={props.onForce}/>
            </div>
            <CheckTable filteredCheckCount={props.response?.filteredCount ?? 0}
                        showAmount={props.params.limit}
                        checks={props.response?.checks ?? []}
                        isLoading={props.isLoading}
                        onPageChange={newPage => props.onParamsChange("skip", props.params.limit * (newPage - 1))}
                        page={Math.ceil(props.params.skip / props.params.limit) + 1}
                        renderFunction={props.renderCheck} />
            {props.modal && <CheckTableModal check={props.modal.check} closeHandler={props.modal.onClose}/>}
        </ContentTitle>
    );
};

export default CheckTableWrapper;