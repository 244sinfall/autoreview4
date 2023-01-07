import React, {useCallback, useState} from 'react';
import './style.css'

type TabControllerProps = {
    className?: string,
    items: {
        [key: string]: React.ReactNode | React.ReactNode[]
    };
};

const TabController = (props: TabControllerProps) => {
    const [selectedTab, setSelectedTab] = useState<keyof typeof props.items | null>(null)
    const callbacks = {
        onTabClick: useCallback((item: string) => {
            const key = item as keyof TabControllerProps
            if(selectedTab === key) return setSelectedTab(null)
            setSelectedTab(key)
        }, [selectedTab])
    }
    return (
        <div className="TabController-container">
            <div className="TabController-controls">
                {Object.keys(props.items).map((item) =>
                    <button key={item} className={"tab-selector" + (selectedTab === item ? " tab-selector_selected" : "")}
                            onClick={() => callbacks.onTabClick(item)}>
                        {item}
                    </button>
                )}
            </div>
            <div className={"TabController-content" + (props.className ? ` ${props.className}` : "")}>
                {selectedTab && props.items[selectedTab]}
            </div>
        </div>
    );
};

export default React.memo(TabController);