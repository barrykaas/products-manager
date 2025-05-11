import { Fragment } from "react";
import { List } from "@mui/material";

import { linkOrOnClick } from "src/utils/linkOrOnClick";
import { ReceiptsListItem } from "./ReceiptsListItem";


export function ReceiptsList({
    receipts = [],
    getListItemProps = () => ({}),
    onClickReceipt,
    ...props
}) {
    return (
        <List
            sx={{ width: 1 }}
            {...props}
        >
            {receipts.map((receipt) =>
                <Fragment key={receipt.id}>
                    <ReceiptsListItem
                        receipt={receipt}
                        {...linkOrOnClick(
                            onClickReceipt ?
                                () => onClickReceipt(receipt)
                                : '/receipts/' + receipt.id)
                        }
                        {...getListItemProps(receipt)}
                    />
                </Fragment>
            )}
        </List>
    );
}
