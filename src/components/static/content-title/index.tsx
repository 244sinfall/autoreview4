import React, {useState} from 'react';
import './style.css';


const ContentTitle = (props: { title: string, controllable: boolean, children: React.ReactNode[] | React.ReactNode }) => {
    const [hidden, setHidden] = useState(false)
    return (
        <div className="content-block">
            <span className="content-block__title">
                <p className="content-block__title-text">{props.title}</p>
                {props.controllable && <p className="content-block__title-control" onClick={() => setHidden(!hidden)}>{hidden ? "Показать": "Скрыть"}</p>}
            </span>
            {!hidden && <div className="content-block__container">{props.children}</div>}
        </div>
    );
};

export default React.memo(ContentTitle);