import { useState } from "react";

import InfiniteData from "../components/ui/InfiniteData";
import Page from "../components/ui/Page";
import { TransactionsList, usePaginatedTransactions, TransactionForm } from "../features/transactions";
import DialogWindow from "../components/ui/DialogWindow";

export default function Transactions() {
    const { data, hasNextPage, fetchNextPage, isLoading } = usePaginatedTransactions();
    const transactions = data ? data.pages.flatMap(page => page.results) : [];
    const [editing, setEditing] = useState({});
    const [editFormOpen, setEditFormOpen] = useState(false);

    const closeForm = () => setEditFormOpen(false);

    return (
        <>
            <Page
                title="Transacties"
                maxWidth="xs"
                onAdd={() => {
                    setEditing({});
                    setEditFormOpen(true);
                }}
            >
                <InfiniteData
                    hasMore={hasNextPage}
                    onMore={fetchNextPage}
                    isLoading={isLoading}
                >
                    <TransactionsList
                        transactions={transactions}
                        onSelect={(transaction) => {
                            setEditing(transaction);
                            setEditFormOpen(true);
                        }}
                    />
                </InfiniteData>
            </Page>

            <DialogWindow
                open={editFormOpen}
                onClose={closeForm}
            >
                <Page
                    title={editing.id ? "Bewerk Transactie" : "Nieuwe Transactie"}
                    onClose={closeForm}
                    pb={0}
                >
                    <TransactionForm
                        initialTransaction={editing}
                        onSuccess={closeForm}
                        onSuccessfulDelete={closeForm}
                    />
                </Page>
            </DialogWindow>
        </>
    );
}
