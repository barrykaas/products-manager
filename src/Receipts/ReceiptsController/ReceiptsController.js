import { useState } from "react";

import ReceiptsList from "./ReceiptsList";
import { ReceiptFormDialog } from "../ReceiptForm";
import { useListsInvalidator } from "../../Lists/ListsApiQueries";
import ControllerView from "../../Helpers/ControllerView";


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
            <ControllerView
                title="Bonnetjes"
                onRefresh={onRefresh}
                onAdd={onAddReceipt}
            >
                <ReceiptsList onSelectItem={selectReceipt} />
            </ControllerView>

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
