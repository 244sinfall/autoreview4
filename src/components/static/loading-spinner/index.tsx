import React, {useMemo, useRef} from 'react';
import './styles.css'

const LoadingSpinner = (props: {spin: boolean, children: React.ReactNode | React.ReactNode[]}) => {
    const cn = useMemo(() => {
        return props.spin ? "spinner active" : "spinner"
    }, [props.spin])
    const container = useRef<HTMLDivElement>(null)
    return (
        <div className={cn} ref={container}>
            {props.spin && <div className="loader" style={container.current ? {height: container.current.offsetHeight /2 , width: container.current.offsetHeight/2} : {height: 80, width: 80}}/> }
            <div className="contents">{props.children}</div>
        </div>
    );
};

export default LoadingSpinner;