import React, {useRef} from 'react';
import styled, {css} from "styled-components";

type FieldSectionOptions = {
    direction?: "column" | "row"
    align?: "center"
    justify?: "space-between" | "center" | "flex-start"
    gap?: number
    collapsedOptions?: Omit<FieldSectionOptions , 'collapsedOptions'> & {widthToCollapse?: number}
}

type FieldOptions = {
    className?: string
    title: string | React.ReactNode | React.ReactNode[]
    children: React.ReactNode | React.ReactNode[]
    containerOptions?: FieldSectionOptions
}

const FieldContainer = styled.span<FieldSectionOptions>`
    display: flex;
    flex-direction: ${props => props.direction};
    align-items: ${props => props.align};
    justify-content: ${props => props.justify};
    gap: ${props => props.gap ?? 5}px;
    ${props => props.collapsedOptions && css`
      @media screen and (max-width: ${props.collapsedOptions.widthToCollapse}px) {
        flex-direction: ${props.collapsedOptions.direction ?? "column"};
        align-items: ${props.collapsedOptions.align ?? "center"};
        justify-content: ${props.collapsedOptions.justify ?? "center"};
      }
    `}

`

const Field = (props: FieldOptions) => {
    const titleRef = useRef<HTMLSpanElement>(null)
    const contentRef = useRef<HTMLSpanElement>(null)
    return (
        <FieldContainer className={props.className}
                        align={props.containerOptions?.align ?? "center"}
                        justify={props.containerOptions?.justify ?? "space-between"}
                        direction={props.containerOptions?.direction ?? "row"}
                        collapsedOptions={props.containerOptions && {...props.containerOptions.collapsedOptions,
                        widthToCollapse: props.containerOptions?.collapsedOptions?.widthToCollapse ??
                            (titleRef.current?.clientWidth ?? 200) + (contentRef.current?.clientWidth ?? 200)}}
        >
            <span ref={titleRef} className="field__title">
                {props.title}
            </span>
            <span ref={contentRef} className="field__content">
                {props.children}
            </span>
        </FieldContainer>
    );
};

export default React.memo(Field);