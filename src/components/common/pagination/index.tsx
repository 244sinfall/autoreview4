import React, {useCallback, useMemo, useRef} from 'react';
import './styles.css'
import NumberInput from "../number-input";
import ActionButton from "../action-button";
import Field from "../field";

type PaginationProps = {
    className?: string,
    itemsTotal: number,
    itemsPerPage: number,
    currentPage: number,
    onPageChange: (newPage: number) => void,
}

const Pagination = (props: PaginationProps) => {
    const pageSelectorValue = useRef<number>(1);
    
    const totalPages = useMemo(() => {
        return Math.ceil(props.itemsTotal/props.itemsPerPage)
    }, [props])
    
    const displayingPages = useMemo(() => {
        let pages = []
        if(props.currentPage !== 1 && props.currentPage > 2) pages.push(<p key="1" className="page" onClick={() => props.onPageChange(1)}>1</p>)
        if(props.currentPage > 3) pages.push(<p key="del1" className="delimiter">...</p>)
        if(props.currentPage > 1) pages.push(<p key="cur-1" className="page" onClick={() => props.onPageChange(props.currentPage-1)}>{props.currentPage-1}</p>)
        pages.push(<p key="cur" className="page current">{props.currentPage}</p>)
        if(props.currentPage < totalPages) pages.push(<p key="cur+1" className="page" onClick={() => props.onPageChange(props.currentPage+1)}>{props.currentPage+1}</p>)
        if(props.currentPage + 1 < totalPages) {
            if(totalPages > props.currentPage+2) pages.push(<p key="del2" className="delimiter">...</p>)
            pages.push(<p key="tp" className="page" onClick={() => props.onPageChange(totalPages)}>{totalPages}</p>)
        }
        return pages
    }, [props, totalPages])//Первая, последняя, текущая и две вокруг нее
    
    const callbacks = {
        onPageChange: useCallback(() => {
            if(pageSelectorValue.current >= 1 && pageSelectorValue.current <= totalPages) {
                props.onPageChange(pageSelectorValue.current)
            }
        }, [props, totalPages])
    }
    return (
        <div className={"pagination" + (props.className ? ` ${props.className}` : "")}>
            <span className="pagination-pages">{displayingPages}</span>
            <span className="pagination-control">
                <Field title="Перейти к">
                    <NumberInput className="pagination-number"
                                 minValue={1}
                                 maxValue={totalPages} 
                                 onChange={(value) => pageSelectorValue.current = value}/>
                </Field>
                <ActionButton title="Перейти к странице" onClick={callbacks.onPageChange}/>
            </span>
        </div>
    );
};

export default React.memo(Pagination);