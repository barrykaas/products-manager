import FormDialog from "../Helpers/FormDialog";
import ProductController from "./ProductController";


export default function ProductPicker({ handleSelectedProduct, open, onClose }) {
    return (
        <FormDialog
            hasToolbar={false}
            open={open}
            onClose={onClose}
        >
            <ProductController
                onClose={onClose}
                handleSelectedProduct={handleSelectedProduct}
            />
        </FormDialog>
    );
}
