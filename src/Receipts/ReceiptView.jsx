import { useLoaderData, useNavigate } from "react-router-dom";
import { Divider } from "@mui/material";

import ReceiptForm from "./ReceiptForm";
import ControllerView from "../Helpers/ControllerView";
import { listsQueryKey } from "../Lists/ListsApiQueries";
import ReceiptEditor from "./ReceiptEditor/ReceiptEditor";


export const loader = (queryClient) =>
    async ({ params }) => {
        const receiptId = params.receiptId;
        if (receiptId) {
            return queryClient.ensureQueryData({ queryKey: [listsQueryKey, receiptId] });
        } else {
            return
        }
    }


export default function ReceiptView() {
    const initialValues = useLoaderData();
    const navigate = useNavigate();

    const existingReceiptId = initialValues?.id;

    return (
        <ControllerView
            title="Bewerk Bon"
            onBack={() => navigate(-1)}
            maxWidth="md"
        >
            <ReceiptForm
                initialValues={initialValues}
                onSuccessfulCreateEdit={(receipt) => navigate(`../${receipt.id}`, { replace: true, relative: 'path' })}
                onSuccessfulDelete={() => navigate('..', { replace: true, relative: 'path' })}
            />

            {existingReceiptId &&
                <>
                    <Divider />
                    <ReceiptEditor receiptId={initialValues?.id} />
                </>
            }

        </ControllerView>
    );
}
