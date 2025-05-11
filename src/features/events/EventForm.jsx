import { MoreHoriz } from "src/components/icons";
import DialogWindow from "src/components/ui/DialogWindow";
import Page from "src/components/ui/Page";

import { useFormik } from 'formik';
import { Button, Box, TextField, Stack, Paper, Divider, Typography, Tabs, Tab } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import * as yup from 'yup';
import 'dayjs/locale/en-gb';

import { useEventDeleter, useEventMutation } from './api';
import DateField from 'src/components/form/DateField';
import DateLabel from 'src/components/ui/DateLabel';
import ModelInstanceForm from "src/components/ui/ModelInstanceForm";
import { PersonsChecklist, PersonsField } from "src/features/persons";
import { useState } from "react";
import { useTemporaryState } from "src/hooks/useTemporaryState";
import { ReceiptItemsList, ReceiptsList, usePaginatedReceiptItems, usePaginatedReceipts } from "src/features/receipts";
import TabPanel from "src/components/ui/TabPanel";
import { Link } from "react-router";
import { emptyForm } from "./defaultEventForm";


const validationSchema = yup.object({
    date: yup
        .date('Enter date of event')
        .nullable(),
    participations: yup.array(
        yup.object({
            participant: yup.number()
        })
    ),
    name: yup
        .string('Enter name'),
    organizers: yup.array(yup.number())
});

export function EventForm({
    onSuccessfulCreateEdit,
    onSuccessfulDelete,
    initialValues = {}
}) {
    const existing = !!initialValues?.id;
    const [success, setSuccess] = useTemporaryState(undefined);

    const confirmDelete = useConfirm();
    const deleteEvent = useEventDeleter({
        onSuccess: onSuccessfulDelete
    }).mutate;
    const mutateEvent = useEventMutation({
        onSuccess: (response) => {
            const newItem = response.data;
            setSuccess('success');
            onSuccessfulCreateEdit(newItem);
        }
    }).mutate;
    const onDelete = () => {
        confirmDelete({ description: `Verwijderen van ${initialValues?.name}` })
            .then(() => {
                deleteEvent(initialValues?.id);
            })
            .catch(() => { });
    };

    initialValues = {
        ...emptyForm(),
        ...initialValues
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            mutateEvent(values);
        },
    });

    return (
        <ModelInstanceForm
            instanceExists={existing}
            onSubmit={formik.handleSubmit}
            onDelete={onDelete}
            success={success}
        >
            <TextField
                fullWidth
                id="name"
                name="name"
                label="Naam van het event"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
            />

            <DateField
                id="event_date"
                name="event_date"
                label="Datum"
                clearable
                value={formik.values.date}
                onChange={(value) => {
                    formik.setFieldValue('date', value);
                }}
                slotProps={{
                    textField: {
                        helperText: formik.touched.date && formik.errors.date,
                        error: formik.touched.date && Boolean(formik.errors.date)
                    },
                }}
            />

            <Paper variant="outlined" >
                <PersonsChecklist
                    setSelected={(participants) => formik.setFieldValue('participations', participants.map(
                        participant => ({ participant })
                    ))}
                    selected={formik.values.participations.map(p => p.participant)}
                />
            </Paper>

            <PersonsField
                label="Georganiseerd door"
                selected={formik.values.organizers || []}
                setSelected={(ids) => formik.setFieldValue('organizers', ids)}
            />

            <DateLabel
                created={initialValues.date_created}
                modified={initialValues.date_modified}
            />
        </ModelInstanceForm>

    );
};

function RelatedReceipts({ eventId }) {
    const { data, hasNextPage } = usePaginatedReceipts({
        page_size: 5,
        event: eventId
    });
    const receipts = data ? data.pages[0].results : [];

    return (
        <Paper>
            <ReceiptsList
                disablePadding
                receipts={receipts}
            />
            {hasNextPage &&
                <Button
                    startIcon={<MoreHoriz />}
                    fullWidth
                    component={Link}
                    to={`/receipts/?event=${eventId}`}
                >
                    Meer bonnetjes met dit event
                </Button>
            }
        </Paper>
    );
}

function RelatedReceiptItems({ eventId }) {
    const { data, hasNextPage } = usePaginatedReceiptItems({
        page_size: 10,
        event: eventId
    });
    const receiptItems = data ? data.pages[0].results : [];

    return (
        <>
            <ReceiptItemsList receiptItems={receiptItems} />
            {hasNextPage &&
                <Button
                    component={Link}
                    to={`/receipt-items?event=${eventId}`}
                    startIcon={<MoreHoriz />}
                    fullWidth
                >
                    Alle items van dit event
                </Button>
            }
        </>
    );
}

export function EventFormDialog({
    initialValues,
    open,
    onClose,
    onSuccessfulCreateEdit,
    onSuccessfulDelete,
}) {
    const existing = !!initialValues.id;
    const [tab, setTab] = useState(0);

    return (
        <DialogWindow
            onClose={onClose}
            open={open}
        >
            <Page
                title={existing ? 'Bewerk event' : 'Creëer event'}
                onClose={onClose}
                dialog
            >
                <EventForm
                    initialValues={initialValues}
                    onSuccessfulCreateEdit={onSuccessfulCreateEdit}
                    onSuccessfulDelete={onSuccessfulDelete}
                />

                {existing && initialValues.list_count > 0 &&
                    <>
                        <Divider />
                        <Tabs
                            value={tab}
                            onChange={(e, newTab) => setTab(newTab)}
                        >
                            <Tab label="Items" id={0} />
                            <Tab label="Bonnetjes" id={1} />
                        </Tabs>
                        <TabPanel index={0} value={tab}>
                            <RelatedReceiptItems eventId={initialValues.id} />
                        </TabPanel>
                        <TabPanel index={1} value={tab}>
                            <RelatedReceipts eventId={initialValues.id} />
                        </TabPanel>
                    </>
                }
            </Page>
        </DialogWindow>
    );
}
