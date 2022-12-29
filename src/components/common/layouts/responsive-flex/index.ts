import styled from "styled-components";

export const LayoutReponsiveFlex = styled.div<{direction: "column" | "row", gap: number}>`
    display: flex;
    flex-direction: ${props => props.direction};
    gap: ${props => props.gap}px;
`