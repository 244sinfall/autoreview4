import React from 'react';
import './styles.css'


const Table = (props: {columns: string[], content: any[], handleClick: (clickedData: any, tableIndex?: number) => void}) => {
    const contentArr = props.content.map(c => Object.values(c))
    let mousePos: [number, number]
    return (
        <table className="table">
            <thead className="table-head">
            <tr className="table-row">{props.columns.map(c => <th key={c+"header"} className="table-content">{c}</th>)}</tr></thead>
            <tbody>{contentArr.map((v: any[], idx) => {
            return (
                <tr key={v[0]+"row"+Math.random()} className="table-row" onMouseDown={e => mousePos = [e.clientX, e.clientY]}
                       onMouseUp={e => mousePos && mousePos[0] === e.clientX && mousePos[1] === e.clientY && props.handleClick(v, idx)}>
                {v.map((str, idx) => <td key={props.columns[idx]+"content"+idx}
                                         className="table-content"
                                         data-label={props.columns[idx]+":"}>{str ? String(str) : ""}</td>)}
                </tr>)
            })}</tbody>
        </table>
    );
};

export default React.memo(Table);