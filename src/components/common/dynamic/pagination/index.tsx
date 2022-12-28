import React, {useMemo, useState} from 'react';
import './styles.css'
import NumberInput from "../number-input";
import ActionButton from "../../static/action-button";

const Pagination = (props: {itemsAmount: number, itemsPerPage: number, currentPage: number, clickHandler: (page: number) => void}) => {
    const [pageToGo, setPageToGo] = useState(1)
    const totalPages = useMemo(() => {
        return Math.ceil(props.itemsAmount/props.itemsPerPage)
    }, [props])
    const displayingPages = useMemo(() => {
        let pages = []
        if(props.currentPage !== 1 && props.currentPage > 2) pages.push(<p key="1" className="page" onClick={() => props.clickHandler(1)}>1</p>)
        if(props.currentPage > 3) pages.push(<p key="del1" className="delimiter">...</p>)
        if(props.currentPage > 1) pages.push(<p key="cur-1" className="page" onClick={() => props.clickHandler(props.currentPage-1)}>{props.currentPage-1}</p>)
        pages.push(<p key="cur" className="page current">{props.currentPage}</p>)
        if(props.currentPage < totalPages) pages.push(<p key="cur+1" className="page" onClick={() => props.clickHandler(props.currentPage+1)}>{props.currentPage+1}</p>)
        if(props.currentPage + 1 < totalPages) {
            if(totalPages > props.currentPage+2) pages.push(<p key="del2" className="delimiter">...</p>)
            pages.push(<p key="tp" className="page" onClick={() => props.clickHandler(totalPages)}>{totalPages}</p>)
        }
        return pages
    }, [props, totalPages])//Первая, последняя, текущая и две вокруг нее
    return (
        <div className="pagination">
            <span className="pagination-pages">{displayingPages}</span>
            <span className="pagination-control">
                <NumberInput title={"Перейти к"} minValue={0} maxValue={totalPages} disabled={false} handler={(fn, fv) => setPageToGo(fv)}/>
                <ActionButton title={"Перейти"} show={true} action={() => {
                    if(pageToGo >= 1 && pageToGo <= totalPages) {
                        props.clickHandler(pageToGo)
                    }
                }} requiresLoading={false}/>
            </span>
        </div>
    );
};

export default Pagination;