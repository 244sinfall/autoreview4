import styled from "styled-components";

type LayoutRowColumnInfo = {
    maxWidth?: number,
    minWidth?: number,
}

type LayoutRowProps = {
    columns: LayoutRowColumnInfo[],
    gap: number,

}

export const LayoutResponsiveGrid = styled.div<LayoutRowProps>`
    display: grid;
    grid-gap: ${props => props.gap}px;
    grid-template-columns: ${props => props.columns.map(column => column.maxWidth ? (String(column.maxWidth) + "px ") : "1fr ")};
    @media screen and (max-width: ${props => {
        const minWidthColumns = props.columns.filter(column => column.minWidth)
        if(minWidthColumns.length === 0) return props.columns.length * 350 + props.gap * props.columns.length
        return minWidthColumns.reduce((acc, column) => acc + (column.minWidth ?? 350) + props.gap, 0)
    }}px) {
        grid-template-columns: 1fr;
    }
`