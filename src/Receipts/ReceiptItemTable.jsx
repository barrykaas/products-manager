import { Fragment } from "react";
import { ListItemAvatar, ListItemButton, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { partition } from "../Helpers/arrays";
import ProductCard from "../Products/ProductCard";
import { useReceipt } from "./api";
import { formatEuro } from "../Helpers/monetary";
import { isoToRelativeDate } from "../Helpers/dateTime";
import { useFormatListItemQuantity } from "./useFormatQuantity";
import { ReceiptAvatar } from "./ReceiptsController/ReceiptsList";


const priceColWidth = 80;

export default function ReceiptItemTable({ receiptItems, ...props }) {
    const groupedReceiptItems = partition(receiptItems, (prev, curr) => prev.receipt === curr.receipt);

    return (
        <Stack spacing={2} {...props}>
            {groupedReceiptItems.map(group =>
                <Fragment key={group[0].receipt + '-' + group[0].id}>
                    <ReceiptBlock receiptId={group[0].receipt} receiptItems={group} />
                </Fragment>
            )}
        </Stack>
    );
}


function ReceiptBlock({ receiptId, receiptItems }) {
    const total = receiptItems.reduce((sum, receiptItem) => sum + Number(receiptItem.amount), 0);

    return (
        <Table component={Paper} size="small">
            <TableHead>
                <TableRow>
                    <TableCell colSpan={3} padding="none">
                        <ReceiptLabel receiptId={receiptId} />
                    </TableCell>
                    <TableCell align="right"
                        sx={{
                            textWrap: "nowrap",
                            width: priceColWidth
                        }}
                    >
                        {formatEuro(total)}
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {receiptItems.map(receiptItem =>
                    <Fragment key={receiptItem.id}>
                        <ReceiptItemRow receiptItem={receiptItem} />
                    </Fragment>
                )}
            </TableBody>
        </Table>
    );
}

function ReceiptItemRow({ receiptItem }) {
    const single = Number(receiptItem.quantity) === 1;
    const quantityString = useFormatListItemQuantity(receiptItem);

    return (
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            hover
        >
            <TableCell align="right"
                sx={{
                    textWrap: "nowrap",
                    width: 80
                }}
            >
                {!single && quantityString}
            </TableCell>
            <TableCell
            >
                {receiptItem.product ?
                    <ProductCard productId={receiptItem.product} />
                    : receiptItem.description}
            </TableCell>
            <TableCell align="right"
                sx={{
                    textWrap: "nowrap",
                    width: priceColWidth
                }}
            >
                {!single && formatEuro(receiptItem.price)}
            </TableCell>
            <TableCell align="right"
                sx={{
                    textWrap: "nowrap",
                    width: priceColWidth
                }}
            >
                {formatEuro(receiptItem.amount)}
            </TableCell>
        </TableRow>
    );
}

function ReceiptLabel({ receiptId }) {
    const { data, isLoading } = useReceipt(receiptId);
    const receipt = data;

    return (
        <ListItemButton component={Link} to={`/receipts/${receiptId}`}>
            <ListItemAvatar>
                <ReceiptAvatar payerId={receipt?.payer} marketId={receipt?.market} />
            </ListItemAvatar>

            <Stack width={1}>
                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                >
                    {isLoading ?
                        <Skeleton />
                        : isoToRelativeDate(receipt.date)
                    }
                </Typography>
                <Typography>
                    {isLoading ?
                        <Skeleton />
                        : receipt.name
                    }
                </Typography>
            </Stack>
        </ListItemButton>
    );
}
