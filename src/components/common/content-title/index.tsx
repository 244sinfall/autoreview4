import React, {useState} from 'react';
import './style.css';

type ContentTitleProps = {
    className?: string,
    title: string,
    collapsable?: boolean,
    children: React.ReactNode | React.ReactNode[],

}

const ContentTitle = (props: ContentTitleProps) => {
    const [hidden, setHidden] = useState(false)
    return (
        <div className="content-block">
            <span className="content-block__title">
                <p className="content-block__title-text">{props.title}</p>
                {props.collapsable && <p className="content-block__title-control" onClick={() => setHidden(!hidden)}>{hidden ? "Показать": "Скрыть"}</p>}
            </span>
            {!hidden && <div className={"content-block__container" + (props.className ? ` ${props.className}` : "" )}>{props.children}</div>}
        </div>
    );
};

export default React.memo(ContentTitle);