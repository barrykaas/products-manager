import { Avatar, AvatarGroup, Skeleton, Tooltip } from "@mui/material";

import { usePerson } from "./api";
import { useSettings } from "src/hooks/useSettings";


const defaultSize = 30;

export function PersonAvatar({
    personId,
    size = defaultSize,
    loading = false,
}) {
    const [{ nerdInfo }] = useSettings();
    const { isLoading, isError, data } = usePerson(personId);
    const person = data;

    let tooltip;
    if (person?.name) {
        tooltip = person.name;
        if (nerdInfo) tooltip += ` (${personId})`;
    } else {
        tooltip = 'ID ' + personId;
    }

    let avatar;
    if (loading || isLoading) {
        avatar = (
            <Skeleton
                variant="circular"
                width={size}
                height={size}
            />
        );
    } else {
        avatar = (
            <Avatar
                sx={{
                    height: size,
                    width: size,
                    bgcolor: isError ? 'red' : undefined
                }}
                src={person?.image}
            >
                {isError && '!'}
                {!person?.image &&
                    person.name.slice(0, 2)
                }
            </Avatar>
        );
    }

    return (
        <Tooltip
            arrow
            title={tooltip}
        >
            {avatar}
        </Tooltip>
    );
}

export function PersonAvatarGroup({
    personIds,
    max = 10,
    size = defaultSize,
    ...props
}) {
    if (personIds === null) return;
    if (personIds) personIds.sort();
    return (
        <AvatarGroup max={max} size={size} {...props}>
            {personIds === undefined ?
                [1, 2, 3, 4].map((n) =>
                    <PersonAvatar
                        key={'skeleton-' + n}
                        size={size}
                    />
                )
                :
                personIds.map(personId =>
                    <PersonAvatar
                        key={personId}
                        personId={personId}
                        size={size}
                    />
                )
            }
        </AvatarGroup>
    );
}
