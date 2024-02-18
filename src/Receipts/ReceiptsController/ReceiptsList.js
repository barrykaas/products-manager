import { Divider, Typography, ListItemButton, ListItemText } from "@mui/material";
import { Fragment } from "react";

import { useReceipts } from "../../Lists/ListsApiQueries";
import { usePersons } from "../../Persons/PersonsApiQueries";
import { useMarkets } from "../../Markets/MarketsApiQueries";
import { formatEuro } from "../../Helpers/monetary";
import InfiniteList from "../../Helpers/InfiniteList";


function ReceiptsListItem({ item, onSelect }) {
  const personsQuery = usePersons();
  const { getMarket } = useMarkets();

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
  const eventCount = item.events.length;

  const secondaryInfo = [
    payer,
    getMarket(item.market)?.name,
    `${eventCount} event` + (eventCount === 1 ? '' : 's'),
    `${item.item_count} items`,
    formatEuro(item.amount),
    formattedDate,
  ];

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
            {secondaryInfo.filter(Boolean).join(" - ")}
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
    isError,
    error,
    fetchNextPage
  } = useReceipts();

  const allReceipts = data?.pages.flatMap((page) => page.results) || [];

  return (
    <InfiniteList onMore={fetchNextPage} hasMore={hasNextPage}
      isLoading={isFetching || isFetchingNextPage}
      error={isError ? error : null}
    >
      {allReceipts.map((item) => (
        <Fragment key={item.id}>
          <ReceiptsListItem item={item}
            onSelect={() => onSelectItem(item)} />
          <Divider component="li" />
        </Fragment>
      ))}
    </InfiniteList>
  );
}