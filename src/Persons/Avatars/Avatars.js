import { AvatarGroup } from "@mui/material";

import { usePersons } from "../PersonsApiQueries";
import { ErrorAvatar, LoadingAvatar, DefaultAvatar } from "./PlainAvatars";
import { ImageAvatar } from "./ImageAvatars";


export const defaultSize = 30;

export default function PersonAvatar({ personId, size = defaultSize }) {
    const { isLoading, isError, getPerson } = usePersons();

    if (!personId) return null;

    if (isLoading) {
        return <LoadingAvatar personId={personId} size={size} />;
    } else if (isError) {
        return <ErrorAvatar personId={personId} size={size} />;
    }

    const person = getPerson(personId);

    if (!person) {
        return <ErrorAvatar personId={personId} size={size} />;
    }
    
    if (person.image) {
        return <ImageAvatar person={person} size={size} />;
    } else {
        return <DefaultAvatar person={person} size={size} />;
    }
}

export function PersonAvatarGroup({ personIds = [], size = defaultSize, max = 10 }) {
    personIds.sort();
    return (
        <AvatarGroup max={max} size={size}>
            {personIds.map(personId =>
                <PersonAvatar personId={personId} size={size} />
            )}
        </AvatarGroup>
    );
}
