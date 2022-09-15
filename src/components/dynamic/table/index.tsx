import React from 'react';
import './styles.css'


const Table = (props: {columns: string[], content: any[], handleClick: (clickedData: any) => void}) => {
    const contentArr = props.content.map(c => Object.values(c))
    return (
        <table className="table">
            <thead className="table-head">
            <tr className="table-row">{props.columns.map(c => <th key={c+"header"} className="table-content">{c}</th>)}</tr></thead>
            <tbody>{contentArr.map((v: any[]) => {
            return <tr key={v[0]+"row"} className="table-row" onClick={() => props.handleClick(v)}>{v.map((str, idx) => <td key={props.columns[idx]+"content"+idx} className="table-content" data-label={props.columns[idx]+":"}>{String(str)}</td>)}</tr>
            })}</tbody>
        </table>
    );
};

export default Table;