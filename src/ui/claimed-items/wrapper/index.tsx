import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ClaimedItemInterface, ClaimedItemsTables, ClaimedItemTitles} from "../../../model/claimed-items/types";
import ClaimedItemCategory from "../../../components/claimed-items/table";
import ClaimedItemRow from "../../../components/claimed-items/row";
import {useAppDispatch, useAppSelector} from "../../../services/services/store";
import {setAddModal, setEditModal, setPage} from "../../../model/claimed-items/reducer";
import {PERMISSION} from "../../../model/user";
type ClaimedItemTableProps = {
    quality: keyof ClaimedItemsTables
}
const ClaimedItemTable = (props: ClaimedItemTableProps) => {
    const [isShowing, setIsShowing] = useState(true)
    const state = useAppSelector(state => ({
        content: state.claimedItems.content[props.quality],
        isLoading: state.claimedItems.isLoading,
        search: state.claimedItems.search,
        page: state.claimedItems.page[props.quality],
        user: state.user.user
    }))
    const [displayingContent, setDisplayingContent] = useState<ClaimedItemInterface[]>([])
    const searchDebounce = useRef<NodeJS.Timeout | null>(null)
    useEffect(() => {
        if(!state.search) return setDisplayingContent(state.content)
        if(searchDebounce.current) clearTimeout(searchDebounce.current)
        searchDebounce.current = setTimeout(() => {
            setDisplayingContent(state.content.filter(content => {
                    const searchPhrase = state.search.toLowerCase()
                    return content.name.toLowerCase().includes(searchPhrase)
                        || content.owner.toLowerCase().includes(searchPhrase)
                        || content.ownerProofLink.toLowerCase().includes(searchPhrase)
                        || content.reviewer.toLowerCase().includes(searchPhrase)
                        || content.acceptor.toLowerCase().includes(searchPhrase)
                        || content.additionalInfo.toLowerCase().includes(searchPhrase)
                        || content.link.toLowerCase().includes(searchPhrase)
                }
            ))
        }, 300)

    }, [state.content, state.search])
    const dispatch = useAppDispatch();
    const renderFunction = useCallback((item: ClaimedItemInterface) => {
        return <ClaimedItemRow key={item.id} item={item} onClick={() => {
            if(state.user.permission >= PERMISSION.Reviewer) {
                dispatch(setEditModal(item))
            }
        }}/>
    }, [dispatch, state.user])
    return (
        <ClaimedItemCategory isShowing={isShowing} page={state.page} onPaginate={(page) =>
                                                                    dispatch(setPage({key: props.quality, page}))}
                             onAdd={() => dispatch(setAddModal(props.quality))}
                             isReviewer={state.user.permission >= PERMISSION.Reviewer}
                             content={displayingContent}
                             isLoading={state.isLoading}
                             title={ClaimedItemTitles[props.quality]}
                             render={renderFunction}
                             onIsShowingChange={() => setIsShowing((prev) => !prev)} />
    );
};

export default React.memo(ClaimedItemTable);