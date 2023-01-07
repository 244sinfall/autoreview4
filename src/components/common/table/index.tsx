import React from 'react';
import './styles.css'

interface TableProps<T> {
    className?: string
    columns: string[],
    content: T[],
    renderFunction: (item: T) => React.ReactNode | React.ReactNode[],
}

function Table<T extends object>(props: TableProps<T>): JSX.Element {
    return (
        <table className={"table" + (props.className ? ` ${props.className}` : "")}>
            <thead className="table-head">
                <tr className="table-row table-head-row">
                    {props.columns.map(c => <th key={c+"_header"} className="table-content table-header-content">{c}</th>)}
                </tr>
            </thead>
            <tbody>
                {props.content.map(content => props.renderFunction(content))}
            </tbody>
        </table>
    );
}

export default Table;