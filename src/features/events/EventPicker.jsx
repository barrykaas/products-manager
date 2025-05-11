import DialogWindow from "src/components/ui/DialogWindow";
import { SearchParamsProvider } from "src/context/searchParams";
import { EventsPage } from "./EventsPage";


export function EventPicker({
    open,
    onClose,
    onSelectEvent,
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
                <EventsPage
                    title="Kies een event"
                    onClose={onClose}
                    onSelectEvent={onSelectEvent}
                    pb={0}
                />
            </SearchParamsProvider>
        </DialogWindow>
    );
}
