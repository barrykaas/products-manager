import Page from "src/components/ui/Page";
import { BalanceTable } from "src/features/balance";

export default function Balance() {
    return (
        <Page
            title="Balans"
        >
            <BalanceTable />
        </Page>
    );
}
