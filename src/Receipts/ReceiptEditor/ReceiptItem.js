import { Skeleton } from "@mui/material";
import React from "react";

import ReceiptDiscountItem from "./ReceiptDiscountItem";
import ReceiptProductDiscreteItem from "./ReceiptProductDiscreteItem";
import ReceiptProductScalarItem from "./ReceiptProductScalarItem";
import useUnitTypeInfo from "../../UnitTypes/UnitTypeInfo";


function ReceiptProductItem({ item }) {
    const { isLoading, isError, unitTypeInfo, error } = useUnitTypeInfo();

    if (isLoading || isError) {
        return <Skeleton />
    }

    if (unitTypeInfo(item.product.unit_type).discrete === true) {
        return <ReceiptProductDiscreteItem item={item} />;
    } else {
        return <ReceiptProductScalarItem item={item} />;
    }
}

export default function ReceiptItem({ item }) {
    if (item.product) {
        return <ReceiptProductItem item={item} />;
    } else if (item.discount || item.discount === 0) {
        return <ReceiptDiscountItem item={item} />;
    } else {
        return <div>Geen product en ook geen korting? item: {JSON.stringify(item)}</div>;
    }
}
