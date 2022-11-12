import React, {useState} from 'react';
import TabSelector from "../tab-selector";
import './style.css'

type TabControllerProps = {
    [key: string]: React.ReactNode | React.ReactNode[];
};

const TabController = (props: {items: TabControllerProps}) => {
    const [selectedTab, setSelectedTab] = useState<keyof TabControllerProps | null>(null)
    const callbacks = {
        onTabClick: (item: string) => {
            const key = item as keyof TabControllerProps
            if(selectedTab === key) return setSelectedTab(null)
            setSelectedTab(key)
        }
    }
    return (
        <div className="TabController-container">
            <div className="TabController-controls">
                {Object.keys(props.items).map(item => <TabSelector selected={item === selectedTab} title={item} onClick={() => callbacks.onTabClick(item)}/>)}
            </div>
            <div className="TabController-content">
                {selectedTab && props.items[selectedTab]}
            </div>
        </div>
    );
};

export default React.memo(TabController);