import { useState } from "react";

import Page from "src/components/ui/Page";
import { searchParamsToObject } from "src/utils/searchParams";
import InfiniteData from "src/components/ui/InfiniteData";
import useSearchParams, { useSearchParamsSearch } from "src/hooks/useSearchParams";
import FilterDialog from "src/components/ui/FilterDialog";
import { usePaginatedProducts } from "./api";
import { ProductsList } from "./ProductsList";
import { ProductFormDialog } from "./ProductForm";


const filterOptions = [
    {
        type: 'market',
        param: 'market',
    },
    {
        type: 'ordering',
        param: 'ordering',
        options: {
            date_created: 'Datum gecreëerd',
        }
    },
];


export function ProductsPage({
    onClose,
    onBack,
    onClickProduct,
    ...props
}) {
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useSearchParamsSearch(true);
    const { data, hasNextPage, fetchNextPage, isLoading } = usePaginatedProducts(searchParamsToObject(searchParams));
    const products = data ? data.pages.flatMap(page => page.results) : [];
    const [filterOpen, setFilterOpen] = useState(false);

    const [editorOpen, setEditorOpen] = useState(false);
    const [editorInitial, setEditorInitial] = useState({});

    const editProduct = (product) => {
        setEditorInitial(product);
        setEditorOpen(true);
    }

    let onEditProduct;
    if (onClickProduct) {
        onEditProduct = editProduct;
    } else {
        onClickProduct = editProduct;
    }

    return (
        <Page
            title="Producten"
            maxWidth="sm"
            handleNewSearch={setSearch}
            initialSearch={search}
            onFilter={() => setFilterOpen(true)}
            onAdd={() => editProduct({})}
            onClose={onClose}
            onBack={onBack}
            {...props}
        >
            <InfiniteData
                onMore={fetchNextPage}
                hasMore={hasNextPage}
                isLoading={isLoading}
                empty={products.length === 0}
            >
                <ProductsList
                    products={products}
                    onClickProduct={onClickProduct}
                    onEditProduct={onEditProduct}
                />
            </InfiniteData>

            <FilterDialog
                onClose={() => setFilterOpen(false)}
                open={filterOpen}
                options={filterOptions}
            />

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
