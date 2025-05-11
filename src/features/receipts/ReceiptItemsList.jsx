import { Fragment } from "react";
import { ListItemAvatar, ListItemButton, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Link } from "react-router";

import { partition } from "src/utils/arrays";
import { ProductContent, useProduct } from "src/features/products";
import { useReceipt } from "./api";
import { formatEuro } from "src/utils/monetary";
import { isoToRelativeDate } from "src/utils/dateTime";
import ReceiptAvatar from "./ReceiptAvatar";
import { formatProductQuantity } from "src/utils/productQuantity";


const priceColWidth = 80;

export function ReceiptItemsList({ receiptItems, ...props }) {
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
    const product = useProduct(receiptItem?.product).data;

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
            <TableCell sx={{ p: 0 }}>
                {product ?
                    <ProductContent product={product} hidePrice />
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
                <ReceiptAvatar receipt={receipt} />
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

function useFormatListItemQuantity(listItem) {
    const product = useProduct(listItem.product)?.data;
    const unit = product?.unit_type?.physical_unit;
    const discrete = product?.unit_type?.discrete;

    if (product && !discrete) {
        return formatProductQuantity({ unit, volume: Number(listItem.quantity) });
    } else {
        return `${Number(listItem.quantity)}`;
    }
}
