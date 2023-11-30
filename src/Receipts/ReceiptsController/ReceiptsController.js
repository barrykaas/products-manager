import { useState } from "react";
import ReceiptsAppBar from "./ReceiptsAppBar";
import ReceiptsList from "./ReceiptsList/ReceiptsList";
import FormDialog from "../../Helpers/FormDialog";
import ReceiptForm from "../ReceiptForm/ReceiptForm";


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


    return (
        <>
            <ReceiptsAppBar handleAddButton={onAddReceipt} />

            <ReceiptsList onSelectItem={selectReceipt} />

            <FormDialog
                open={isEditing}
                onClose={() => setIsEditing(false)}
                title={initialFormData?.name || 'Nieuw bonnetje'}
            >
                <ReceiptForm initialValues={initialFormData} />
            </FormDialog> 
        </>
    );
}
