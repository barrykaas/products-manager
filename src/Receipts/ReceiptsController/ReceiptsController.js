import { useState } from "react";

import ReceiptsList from "./ReceiptsList";
import { useListsInvalidator } from "../../Lists/ListsApiQueries";
import ControllerView from "../../Helpers/ControllerView";
import useUrlSearchQuery from "../../Helpers/urlSearchQuery";
import FilterDialog from "../../Helpers/FilterDialog";
import useLocalSearchParams from "../../Helpers/localSearchParams";


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


export default function ReceiptsController({ onMenu }) {
    const invalidateReceipts = useListsInvalidator();
    const [searchQuery, setSearchQuery] = useUrlSearchQuery();
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchParams, setSearchParams] = useLocalSearchParams(false)

    const onAddReceipt = 'new';

    // Link to receipt editor
    const selectReceipt = (item) => `${item.id}`;

    const onRefresh = invalidateReceipts;

    return (
        <ControllerView
            title="Bonnetjes"
            onRefresh={onRefresh}
            onAdd={onAddReceipt}
            onMenu={onMenu}
            onFilter={() => setFilterOpen(true)}
            initialSearch={searchQuery}
            handleNewSearch={setSearchQuery}
        >
            <ReceiptsList
                onSelectItem={selectReceipt}
                searchQuery={searchQuery}
            />

            <FilterDialog
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                options={filterOptions}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
        </ControllerView>
    );
}
