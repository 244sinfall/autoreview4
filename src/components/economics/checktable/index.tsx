import React from 'react';
import ContentTitle from "../../common/content-title";
import CheckTable from "./table";
import CheckTableFilters from "./filter";
import CheckTableInfo from "./info";
import {CheckResponse, CheckTableParams, ICheck} from "../../../model/economics/checks/types";
import CheckTableModal from "./modal";
import './styles.css'


type CheckTableWrapperProps = {
    isLoading: boolean
    modal?: {
        check: ICheck
        onClose: () => void
    }
    response: CheckResponse | null
    params: CheckTableParams
    onParamsChange: <K extends keyof CheckTableParams, V extends CheckTableParams[K]>(key: K, newParam: V) => void
    error?: string
    isUserAbleToForce: boolean,
    onForce: () => void
    renderCheck: (check: ICheck) => JSX.Element
}
const CheckTableWrapper = (props: CheckTableWrapperProps) => {
    return (
        <ContentTitle className="check-table" title={"Экономические чеки"} collapsable={false}>
            <div className="check-table-top">
                <CheckTableFilters searchOnChange={newSearch => props.onParamsChange("search", newSearch)}
                                   showAmountOnChange={newShowAmount => props.onParamsChange("limit", newShowAmount)}
                                   showAmount={props.params.limit}
                                   selectedType={props.params.category}
                                   statusFilterOnChange={newFilter => props.onParamsChange("status", newFilter)}
                                   statusFilterValue={props.params.status}
                                   typeSelectOnChange={newSelect => props.onParamsChange("category", newSelect)}
                                   typeSelectValues={props.response?.types ?? []}
                                   search={props.params.search}/>
                {props.error && <p className="check-table-error">{props.error}</p>}
                <CheckTableInfo checkCount={props.response?.count ?? 0}
                            filteredCheckCount={props.response?.filteredCount ?? 0}
                            actualDate={props.response?.updatedAt ?? ""}
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