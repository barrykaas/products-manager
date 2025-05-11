import { useLoaderData, useNavigate } from "react-router";
import { CircularProgress } from "@mui/material";

import Page from "src/components/ui/Page";
import { ReceiptEditor, ReceiptForm, useReceipt } from "src/features/receipts";


export const receiptLoader = async ({ params }) => {
    if (params.receiptId === 'new') {
        return null;
    } else {
        return params.receiptId;
    }
}

export default function ReceiptView() {
    const navigate = useNavigate();
    const receiptId = useLoaderData();
    const isNew = receiptId === null;
    const { isLoading, isError, error, data } = useReceipt(receiptId);

    return (
        <Page
            title="Bewerk bon"
            onBack={() => navigate(-1)}
        >
            {!isNew && isLoading && <CircularProgress />}
            {!isNew && isError &&
                <div>
                    Query error:
                    {JSON.stringify(error)}
                </div>
            }
            {(isNew || (!isLoading && !isError)) &&
                <ReceiptForm
                    initialValues={data}
                    onSuccessfulCreateEdit={(receipt) => navigate(`../${receipt.id}`, { replace: true, relative: 'path' })}
                    onSuccessfulDelete={() => navigate('..', { replace: true, relative: 'path' })}
                />
            }
            {!isNew &&
                <ReceiptEditor receiptId={receiptId} />
            }
        </Page>
    );
}
