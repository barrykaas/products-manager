import { useLoaderData, useNavigate } from "react-router-dom";

import ControllerView from "../Helpers/ControllerView";
import { EventForm } from "./EventForm";


export default function EventFormView() {
    const initialValues = useLoaderData();
    const navigate = useNavigate();

    return (
        <ControllerView
            title="Bewerk Event"
            onBack={() => navigate(-1)}
            maxWidth="sm"
        >
            <EventForm
                initialValues={initialValues}
                onSuccessfulCreateEdit={(event) => navigate(`../${event.id}`, { replace: true, relative: 'path' })}
                onSuccessfulDelete={() => navigate('..', { replace: true, relative: 'path' })}
            />
        </ControllerView>
    );
}
