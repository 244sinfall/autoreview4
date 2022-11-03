import React, {useMemo} from 'react';
import './styles.css'

interface TableProps<T> {
    columns: string[],
    content: T[],
    renderFunction?: (item: T) => React.ReactNode | React.ReactNode[],
}

function Table<T extends object>(props: React.PropsWithChildren<TableProps<T>>): JSX.Element {
    const renderContent = useMemo(() => {
        if(props.renderFunction) {
            return props.content.map(item => props.renderFunction!(item))
        } else {
            const contentArr = props.content.map(c => Object.values(c))
            return contentArr.map((v: any[]) => {
                return (
                    <tr key={v[0]+"row"+Math.random()} 
                        className="table-row">
                        {v.map((str, idx) => <td key={props.columns[idx]+"content"+idx}
                                                 className="table-content"
                                                 data-label={props.columns[idx]+":"}>{str ? String(str) : ""}</td>)}
                    </tr>)
            })
        }
    }, [props])

    return (
        <table className="table">
            <thead className="table-head">
            <tr className="table-row">{props.columns.map(c => <th key={c+"header"} className="table-content">{c}</th>)}</tr></thead>
            <tbody>
                {renderContent}
            </tbody>
        </table>
    );
}

export default Table;