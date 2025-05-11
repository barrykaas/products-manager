import Page from "src/components/ui/Page";
import { ReceiptItemsList } from "./ReceiptItemsList";
import { usePaginatedReceiptItems } from "./api";
import InfiniteData from "src/components/ui/InfiniteData";
import useSearchParams, { useSearchParamsSearch } from "src/hooks/useSearchParams";
import { searchParamsToObject } from "src/utils/searchParams";


export function ReceiptItemsPage() {
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useSearchParamsSearch();
    const { data, hasNextPage, isLoading, fetchNextPage } = usePaginatedReceiptItems({
        page_size: 20,
        search,
        ...searchParamsToObject(searchParams)
    });    
    const receiptItems = data ? data.pages.flatMap((page) => page.results) : [];

    return (
        <Page
            title="Bonnetjesitems"
            maxWidth="sm"
            initialSearch={search}
            handleNewSearch={setSearch}
        >
            <InfiniteData
                hasMore={hasNextPage}
                isLoading={isLoading}
                onMore={fetchNextPage}
            >
            <ReceiptItemsList
                receiptItems={receiptItems}
                />
                </InfiniteData>
        </Page>
    );
}
