import { useState } from "react";

import ReceiptsAppBar from "./ReceiptsAppBar";
import ReceiptsList from "./ReceiptsList";
import { ReceiptFormDialog } from "../ReceiptForm";
import { useListsInvalidator } from "../../Lists/ListsApiQueries";


export default function ReceiptsController() {
    const [isEditing, setIsEditing] = useState(false);
    const [initialFormData, setInitialFormData] = useState();
    const invalidateReceipts = useListsInvalidator();

    const onAddReceipt = () => {
        setInitialFormData(undefined);
        setIsEditing(true)
    };
    const selectReceipt = (item) => {
        setInitialFormData(item);
        setIsEditing(true);
    };

    const handleSuccessfulCreateEdit = (newReceipt) => {
        setInitialFormData(newReceipt);
    };

    const onRefresh = invalidateReceipts;

    const onCloseForm = () => {
        setIsEditing(false);
        onRefresh();
    };

    return (
        <>
            <ReceiptsAppBar handleAddButton={onAddReceipt} onRefresh={onRefresh} />

            <ReceiptsList onSelectItem={selectReceipt} />

            <ReceiptFormDialog
                open={isEditing}
                onClose={onCloseForm}

                initialValues={initialFormData}
                onSuccessfulCreateEdit={handleSuccessfulCreateEdit}
                onSuccessfulDelete={() => setIsEditing(false)}
            />

        </>
    );
}
