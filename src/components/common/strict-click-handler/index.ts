import React, {useRef} from "react";

const useStrictClickHandler = (fn: () => void) => {
    const mousePos = useRef<[number, number] | null>(null)
    const startMousePosTarget = useRef<Element | null>(null)
    return {
        recordMousePos: (e: React.MouseEvent) => {
            mousePos.current = [e.clientX, e.clientY]
            startMousePosTarget.current = e.currentTarget
        },
        compareMousePos: (e: React.MouseEvent) => {
            if (mousePos.current
                && mousePos.current[0] === e.clientX && mousePos.current[1] === e.clientY) {
                e.preventDefault()
                fn()
            }
        }
    }
}

export default useStrictClickHandler;