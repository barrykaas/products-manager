import { useState } from "react";

import ReceiptsList from "./ReceiptsList";
import { ReceiptFormDialog } from "../ReceiptForm";
import { useListsInvalidator } from "../../Lists/ListsApiQueries";
import ControllerAppBar from "../../Helpers/ControllerAppBar";


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
            <ControllerAppBar
                title="Bonnetjes"
                onRefresh={onRefresh}
                onAdd={onAddReceipt}
            />

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
