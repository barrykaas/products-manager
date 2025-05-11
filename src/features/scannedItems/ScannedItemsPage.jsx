import { useState } from "react";

import Page from "src/components/ui/Page";
import { searchParamsToObject } from "src/utils/searchParams";
import InfiniteData from "src/components/ui/InfiniteData";
import useSearchParams from "src/hooks/useSearchParams";
import { usePaginatedScannedItems, useScannedItemsInvalidator } from "./api";
import { ScannedItemsList } from "./ScannedItemsList";
import { ProductFormDialog } from "src/features/products";
import FilterChips from "src/components/ui/FilterChips";


export function ScannedItemsPage({ onClose, onBack, onClickProduct, onClickBarcode }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, hasNextPage, fetchNextPage, isLoading } = usePaginatedScannedItems(searchParamsToObject(searchParams));
    const scannedItems = data ? data.pages.flatMap(page => page.results) : [];
    const invalidate = useScannedItemsInvalidator();

    const [editorOpen, setEditorOpen] = useState(false);
    const [editorInitial, setEditorInitial] = useState({});

    const filters = [
        {
            label: 'Alleen onbekend',
            state: searchParams.get('product_unknown') === 'true',
            toggle: (state) => {
                if (state) {
                    searchParams.delete('product_unknown');
                } else {
                    searchParams.set('product_unknown', 'true');
                }
                setSearchParams(searchParams, { replace: true });
            }
        }
    ];

    const editProduct = (product) => {
        setEditorInitial(product);
        setEditorOpen(true);
    }

    if (!onClickProduct) {
        onClickProduct = editProduct;
    }
    if (!onClickBarcode) {
        onClickBarcode = (barcode) => editProduct({ barcode });
    }

    return (
        <Page
            title="Gescand"
            maxWidth="sm"
            onClose={onClose}
            onBack={onBack}
            onRefresh={invalidate}
            appBarSecondary={<FilterChips filters={filters} />}
        >
            <InfiniteData
                onMore={fetchNextPage}
                hasMore={hasNextPage}
                isLoading={isLoading}
            >
                <ScannedItemsList
                    items={scannedItems}
                    onClickProduct={onClickProduct}
                    onClickBarcode={onClickBarcode}
                />
            </InfiniteData>

            <ProductFormDialog
                open={editorOpen}
                onClose={() => setEditorOpen(false)}
                initialValues={editorInitial}
                onSuccessfulCreateEdit={() => setEditorOpen(false)}
                onSuccessfulDelete={() => setEditorOpen(false)}
            />
        </Page>
    );
}
