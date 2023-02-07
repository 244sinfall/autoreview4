import React, {useCallback} from 'react';
import './styles.css'

type SelectorProps<T extends string> = {
    className?: string,
    options: T[],
    onSelectionChange?: (value: T) => void,
    selected?: T
}

const Selector = <T extends string>(props: SelectorProps<T>) => {
    const callbacks = {
        onSelectionChange: useCallback((e: React.SyntheticEvent<HTMLSelectElement>) => {
            if(!props.onSelectionChange) return
            const { selectedIndex } = e.currentTarget;
            const selectedOption = props.options[selectedIndex]
            props.onSelectionChange(selectedOption)
        }, [props])
    }
    return (
        <select className={"selector" + (props.className ? ` ${props.className}` : "")}
                onChange={callbacks.onSelectionChange} value={props.selected}>
            {props.options && props.options.map(o => <option className="option" key={o}>{o}</option>)}
        </select>

    );
};

export default Selector;