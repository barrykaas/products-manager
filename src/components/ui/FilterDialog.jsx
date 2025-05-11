import DialogWindow from "src/components/ui/DialogWindow";
import FilterForm from "src/components/ui/FilterForm";
import Page from "src/components/ui/Page";


export default function FilterDialog({ open, onClose, options }) {
    return (
        <DialogWindow
            open={open}
            onClose={onClose}
        >
            <Page
                onClose={onClose}
                title="Filter"
                pb={0}
            >
                <FilterForm
                    options={options}
                />
            </Page>
        </DialogWindow>
    );
}
