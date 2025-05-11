import DialogWindow from "src/components/ui/DialogWindow";
import { ProductsPage } from "./ProductsPage";
import { SearchParamsProvider } from "src/context/searchParams";


export function ProductPicker({
    open,
    onClose,
    onSelectProduct,
    initialParams = {},
}) {
    return (
        <DialogWindow
            open={open}
            onClose={onClose}
        >
            <SearchParamsProvider
                initialSearchParams={initialParams}
            >
                <ProductsPage
                    title="Kies een product"
                    onClose={onClose}
                    onClickProduct={onSelectProduct}
                    pb={0}
                />
            </SearchParamsProvider>
        </DialogWindow>
    );
}
