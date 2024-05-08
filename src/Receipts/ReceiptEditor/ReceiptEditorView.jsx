import { useLoaderData, useNavigate } from "react-router-dom";

import ReceiptForm from "../ReceiptForm";
import ControllerView from "../../Helpers/ControllerView";
import { listsQueryKey } from "../../Lists/ListsApiQueries";


export const loader = (queryClient) =>
    async ({ params }) => {
        const receiptId = params.receiptId;
        if (receiptId) {
            return queryClient.ensureQueryData({ queryKey: [listsQueryKey, receiptId] });
        } else {
            return
        }
    }


export default function ReceiptEditorView() {
    const initialValues = useLoaderData();
    const navigate = useNavigate();

    return (
        <ControllerView
            title="Bewerk Bon"
            onBack={() => navigate(-1)}
            maxWidth="sm"
        >
            <ReceiptForm
                initialValues={initialValues}
                onSuccessfulCreateEdit={(receipt) => navigate(`../${receipt.id}`, { replace: true, relative: 'path' })}
                onSuccessfulDelete={() => navigate('..', { replace: true, relative: 'path' })}
            />
        </ControllerView>
    );
}
