import { Fragment } from "react";
import { List, ListItemButton, Stack, Typography } from "@mui/material";
import { ArrowRightAlt } from "@mui/icons-material";

import { isoToRelativeDate } from "../../utils/dateTime";
import { PersonAvatar } from "../persons";
import { formatEuro } from "../../utils/monetary";


export function TransactionsList({ transactions, onSelect }) {
    return (
        <List sx={{ width: 1 }}>
            {transactions.map((transaction) =>
                <Fragment key={transaction.id}>
                    <TransactionsListItem
                        transaction={transaction}
                        onClick={onSelect && (() => onSelect(transaction))}
                    />
                </Fragment>
            )}
        </List>
    );
}

function TransactionsListItem({ transaction, ...props }) {
    return (
        <ListItemButton
            divider
            {...props}
        >
            <Stack sx={{ width: 1 }}>
                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                >
                    {isoToRelativeDate(transaction.date)}
                </Typography>
                <Typography>
                    {transaction.description}
                </Typography>
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ pt: 1 }}
                >
                    <PersonAvatar personId={transaction.sender} />
                    <Typography
                        sx={{ width: 70 }}
                        align="center"
                    >
                        {formatEuro(transaction.amount)}
                    </Typography>
                    <ArrowRightAlt />
                    <PersonAvatar personId={transaction.receiver} />
                </Stack>
            </Stack>
        </ListItemButton>
    );
}
