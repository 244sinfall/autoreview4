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
    @media screen and (max-width: ${props => props.columns.reduce((acc, column) => acc + (column.minWidth ?? 350) + props.gap, 0)}px) {
        grid-template-columns: 1fr;
    }
`