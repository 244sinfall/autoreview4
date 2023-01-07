import React from 'react';
import ContentTitle from "../../../common/content-title";
import ReviewField from "../review-field";
import './styles.css'
import TextArea from "../../../common/text-area";
import ReviewButton from "../review-button";

type ReviewGeneratorProps = {
    callbacks: {
        onProfileLinkChange: (newProfileLink: string) => void,
        onDiscordChange: (newDiscord: string) => void,
        onCharNameChange: (newCharName: string) => void,
    }
    profileLink?: string,
    discord?: string,
    charName?: string,
    tooltip: string,
    buttonMessage: string,
    onButton: () => Promise<void>,
    review?: string
}

const ReviewGenerator = (props: ReviewGeneratorProps) => {
    return (
        <ContentTitle title="Генерация вердикта" collapsable={false}>
            <ReviewField title="Ссылка на профиль"
                         maxLength={128}
                         placeholder={"https://rp-wow.ru/users/1018"}
                         onChange={props.callbacks.onProfileLinkChange}
                         value={props.profileLink}
            />
            <ReviewField title="Discord"
                         maxLength={64}
                         placeholder={"rolevik dima#4300"}
                         onChange={props.callbacks.onDiscordChange}
                         value={props.discord}
            />
            <ReviewField title="Ник проверяемого персонажа"
                         maxLength={64}
                         placeholder={"Васян"}
                         onChange={props.callbacks.onCharNameChange}
                         value={props.charName}
            />
            <ReviewButton onButton={props.onButton}
                          buttonMessage={props.buttonMessage}
                          tooltip={props.tooltip}/>
            <TextArea className="review-result" value={props.review} readOnly={true}/>
        </ContentTitle>
    );
};

export default React.memo(ReviewGenerator);