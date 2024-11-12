import FormDialog from "../Helpers/FormDialog";
import ProductController from "./ProductController";


export default function ProductPicker({ handleSelectedProduct, open, onClose, initialParams }) {
    return (
        <FormDialog
            hasToolbar={false}
            open={open}
            onClose={onClose}
        >
            <ProductController
                onClose={onClose}
                handleSelectedProduct={handleSelectedProduct}
                initialParams={initialParams}
            />
        </FormDialog>
    );
}
