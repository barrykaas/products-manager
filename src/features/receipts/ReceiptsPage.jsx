import { useState } from "react";

import Page from "src/components/ui/Page";
import { searchParamsToObject, searchQueryToSearchParams } from "src/utils/searchParams";
import InfiniteData from "src/components/ui/InfiniteData";
import FilterChips from "src/components/ui/FilterChips";
import { useSettings } from "src/hooks/useSettings";
import useSearchParams from "src/hooks/useSearchParams";
import FilterDialog from "src/components/ui/FilterDialog";
import { usePaginatedReceipts } from "./api";
import { ReceiptsList } from "./ReceiptsList";


const filterOptions = [
    {
        type: 'person',
        param: 'payer',
        label: 'Betaler',
    },
    {
        type: 'market',
        param: 'market',
    },
    {
        type: 'ordering',
        param: 'ordering',
        options: {
            date: 'Datum',
            date_created: 'Datum gecreëerd',
            total: 'Totaalbedrag',
            event_count: 'Aantal Events',
            item_count: 'Aantal items',
        }

    }
];


export function ReceiptsPage({ onClose, onBack, onClickReceipt }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, hasNextPage, fetchNextPage, isLoading } = usePaginatedReceipts(searchParamsToObject(searchParams));
    const receipts = data ? data.pages.flatMap(page => page.results) : [];
    const [filterOpen, setFilterOpen] = useState(false);

    const handleNewSearch = (newSearch) => searchQueryToSearchParams(newSearch, searchParams, setSearchParams);

    const [{ userId }] = useSettings();

    const quickFilters = [
        {
            label: 'Van mij',
            state: searchParams.get('payer') == userId,
            toggle: (state) => {
                if (state) {
                    searchParams.delete('payer');
                } else {
                    searchParams.set('payer', userId);
                }
                setSearchParams(searchParams, { replace: true });
            }
        }
    ];

    return (
        <Page
            title="Bonnetjes"
            maxWidth="sm"
            handleNewSearch={handleNewSearch}
            onFilter={() => setFilterOpen(true)}
            // onRefresh
            onAdd="/receipts/new"
            onClose={onClose}
            onBack={onBack}
            appBarSecondary={<FilterChips filters={quickFilters} />}
        >
            <InfiniteData
                onMore={fetchNextPage}
                hasMore={hasNextPage}
                isLoading={isLoading}
            >
                <ReceiptsList
                    receipts={receipts}
                    onClickReceipt={onClickReceipt}
                />
            </InfiniteData>

            <FilterDialog
                onClose={() => setFilterOpen(false)}
                open={filterOpen}
                options={filterOptions}
            />
        </Page>
    );
}
