import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Stack } from "@mui/material";

import ControllerView from "../Helpers/ControllerView";
import { usePaginatedQuery } from "../Api/Common";
import { searchParamsToObject } from "../Helpers/searchParams";
import ReceiptItemTable from "../Receipts/ReceiptItemTable";
import FilterDialog from "../Helpers/FilterDialog";
import { receiptItemsQueryKey } from "./api";


const filterOptions = [
    {
        type: 'ordering',
        param: 'ordering',
        options: {
            date_created: 'Datum gecreëerd',
            date_modified: 'Datum aangepast',
            date: 'Datum v/d lijst',
            quantity: 'Aantal/volume',
            price: 'Prijs',
            amount: 'Bedrag',
        }
    },
    {
        type: 'person',
        label: 'Betaler',
        param: 'payer'
    },
    {
        type: 'market',
        label: 'Winkel',
        param: 'market'
    },
    {
        label: 'Datum',
        type: 'daterange',
        param: 'date',
    },
];

export default function ReceiptItemsView() {
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, hasNextPage, fetchNextPage } = usePaginatedQuery({
        queryKey: [
            receiptItemsQueryKey,
            searchParamsToObject(searchParams)
        ]
    })

    const handleNewSearch = (newSearch) => {
        if (newSearch) {
            searchParams.set('search', newSearch);
        } else {
            searchParams.delete('search')
        }
        setSearchParams(searchParams);
    };

    const receiptItems = (data?.pages || []).flatMap((page) => page.results);

    return (
        <>
            <ControllerView
                title="Bonnetjesitems"
                maxWidth="sm"
                initialSearch={searchParams.get('search')}
                handleNewSearch={handleNewSearch}
                onFilter={() => setFilterOpen(true)}
            >
                <Stack spacing={1}>
                    <ReceiptItemTable receiptItems={receiptItems} />

                    <Button
                        disabled={!hasNextPage}
                        onClick={fetchNextPage}
                        sx={{ height: 100 }}
                    >
                        Meer
                    </Button>
                </Stack>
            </ControllerView>

            <FilterDialog
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                options={filterOptions}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
        </>
    );
}
