import { CircularProgress, List, Button, Divider, Typography, ListItemButton, ListItemText } from "@mui/material";
import { Fragment } from "react";

import { useReceipts } from "../../Lists/ListsApiQueries";
import { usePersons } from "../../Persons/PersonsApiQueries";


function ReceiptsListItem({ item, onSelect }) {
  const personsQuery = usePersons();

  const receiptName = item.name;

  let payer = null;
  if (personsQuery.isLoading) {
    payer = "Betaler wordt geladen...";
  } else if (personsQuery.isError) {
    payer = "Betaler ERROR";
  } else if (!item.payer) {
    payer = "Betaler onbekend"
  } else {
    payer = personsQuery.getPerson(item.payer)?.name
  }

  const receiptDate = new Date(item.transaction_date);
  const formattedDate = receiptDate.toLocaleDateString();

  return (
    <ListItemButton alignItems="flex-start" onClick={onSelect}>
      <ListItemText
        primary={receiptName}
        secondary={
          <>
            <Typography
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="text.primary"
            >

            </Typography>
            {payer + " - " + formattedDate}
          </>
        }
      />
    </ListItemButton>);
}

export default function ReceiptsList({ onSelectItem }) {
  const {
    data,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } = useReceipts();

  const allReceipts = data?.pages.flatMap((page) => page.results) || [];

  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {allReceipts.map((item) => (
          <Fragment key={item.id}>
            <ReceiptsListItem
              item={item}
              onSelect={() => onSelectItem(item)}
            />
            <Divider component="li" />
          </Fragment>
        ))}
      </List>
      {
        isFetching
          ? <CircularProgress />
          : (<Button
            fullWidth
            disabled={!hasNextPage || isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >Laad meer</Button>)
      }
    </>
  );
}