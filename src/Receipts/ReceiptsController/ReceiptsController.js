import { useState } from "react";

import ReceiptsAppBar from "./ReceiptsAppBar";
import ReceiptsList from "./ReceiptsList/ReceiptsList";
import { ReceiptFormDialog } from "../ReceiptForm/ReceiptForm";


export default function ReceiptsController() {
    const [isEditing, setIsEditing] = useState(false);
    const [initialFormData, setInitialFormData] = useState();

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


    return (
        <>
            <ReceiptsAppBar handleAddButton={onAddReceipt} />

            <ReceiptsList onSelectItem={selectReceipt} />

            <ReceiptFormDialog
                open={isEditing}
                onClose={() => setIsEditing(false)}

                initialValues={initialFormData}
                onSuccessfulCreateEdit={handleSuccessfulCreateEdit}
                onSuccessfulDelete={() => setIsEditing(false)}
            />

        </>
    );
}
