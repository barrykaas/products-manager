import { ArrowRightAlt } from "src/components/icons";
import { Fragment } from "react";
import { List, ListItemButton, Skeleton, Stack, Typography } from "@mui/material";

import { isoToRelativeDate } from "../../utils/dateTime";
import { PersonAvatar } from "../persons";
import { formatEuro } from "../../utils/monetary";


export function TransactionsList({ transactions, onSelect }) {
    return (
        <List sx={{ width: 1 }}>
            {transactions.map((transaction) =>
                <Fragment key={transaction?.id}>
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
                    {transaction ?
                        isoToRelativeDate(transaction.date)
                        : <Skeleton />
                    }
                </Typography>
                <Typography>
                    {transaction ?
                        transaction.description
                        : <Skeleton />
                    }
                </Typography>
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ pt: 1 }}
                >
                    <PersonAvatar
                        loading={!transaction}
                        personId={transaction?.sender}
                    />
                    <Typography
                        sx={{ width: 70 }}
                        align="center"
                    >
                        {transaction ?
                            formatEuro(transaction.amount)
                            : <Skeleton />
                        }
                    </Typography>
                    <ArrowRightAlt />
                    <PersonAvatar
                        loading={!transaction}
                        personId={transaction?.receiver}
                    />
                </Stack>
            </Stack>
        </ListItemButton>
    );
}
