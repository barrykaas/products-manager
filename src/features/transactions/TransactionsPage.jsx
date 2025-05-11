import { useState } from "react";

import InfiniteData from "src/components/ui/InfiniteData";
import Page from "src/components/ui/Page";
import { usePaginatedTransactions } from "./api";
import DialogWindow from "src/components/ui/DialogWindow";
import { TransactionsList } from "./TransactionsList";
import { TransactionForm } from "./form";


export function TransactionsPage() {
    const { data, hasNextPage, fetchNextPage, isLoading } = usePaginatedTransactions();
    const transactions = data ? data.pages.flatMap(page => page.results) : [undefined];
    const [editing, setEditing] = useState({});
    const [editFormOpen, setEditFormOpen] = useState(false);

    const closeForm = () => setEditFormOpen(false);

    const onAdd = () => {
        setEditing({});
        setEditFormOpen(true);
    }

    return (
        <>
            <Page
                title="Transacties"
                maxWidth="xs"
                onAdd={onAdd}
            >
                <InfiniteData
                    hasMore={hasNextPage}
                    onMore={fetchNextPage}
                    isLoading={isLoading}
                    empty={!isLoading && transactions.length === 0}
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
                title={editing.id ? "Bewerk Transactie" : "Nieuwe Transactie"}
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
