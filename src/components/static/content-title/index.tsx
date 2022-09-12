import React from 'react';
import './style.css';


const ContentTitle = (props: { title: string, children: React.ReactNode[] | React.ReactNode }) => {
    return (
        <div className="content-block">
            <p className="content-block__title">{props.title}</p>
            <div className="content-block__container">{props.children}</div>
        </div>
    );
};

export default ContentTitle;