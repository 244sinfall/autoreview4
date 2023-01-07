import React, {useCallback, useEffect, useState} from 'react';
import {ClaimedItemInterface, ClaimedItemsTables, ClaimedItemTitles} from "../../../model/claimed-items/types";
import ClaimedItemCategory from "../../../components/claimed-items/table";
import ClaimedItemRow from "../../../components/claimed-items/row";
import {useAppDispatch, useAppSelector} from "../../../model/hooks";
import {setAddModal, setEditModal, setPage} from "../../../model/claimed-items/reducer";
import {PERMISSION} from "../../../model/auth/user";
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
    useEffect(() => {
        if(!state.search) return setDisplayingContent(state.content)
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
    }, [state.content, state.search])
    const dispatch = useAppDispatch();
    const renderFunction = useCallback((item: ClaimedItemInterface) => {
        return <ClaimedItemRow key={item.id} item={item} onClick={() => {
            if(state.user.canAccess(PERMISSION.Reviewer)) {
                dispatch(setEditModal(item))
            }
        }}/>
    }, [dispatch, state.user])
    return (
        <ClaimedItemCategory isShowing={isShowing} page={state.page} onPaginate={(page) =>
                                                                    dispatch(setPage({key: props.quality, page}))}
                             onAdd={() => dispatch(setAddModal(props.quality))}
                             isReviewer={state.user.canAccess(PERMISSION.Reviewer)}
                             content={displayingContent}
                             isLoading={state.isLoading}
                             title={ClaimedItemTitles[props.quality]}
                             render={renderFunction}
                             onIsShowingChange={() => setIsShowing((prev) => !prev)} />
    );
};

export default React.memo(ClaimedItemTable);