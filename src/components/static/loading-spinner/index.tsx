
import './styles.css'
import React, {useCallback, useState} from "react";

const LoadingSpinner = (props: {spin: boolean, children: React.ReactNode | React.ReactNode[]}) => {
    const [size, setSize] = useState(80)
    const container = useCallback((container: HTMLDivElement) => {
        let sizeNow = container?.offsetHeight / 2
        if(isNaN(sizeNow) || !sizeNow) sizeNow = 80
        setSize(sizeNow)
    }, [])
    return (
        <>
        {props.spin ?
                <div className={"spinner active"} ref={container}>
                    {props.spin && <div className="loader" style={{height: size, width: size}}/> }
                    <div className="contents">{props.children}</div>
                </div> : props.children}
        </>
    );
};

export default LoadingSpinner;