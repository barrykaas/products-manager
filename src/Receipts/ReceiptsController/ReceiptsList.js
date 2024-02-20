import { Divider, Typography, ListItemButton, ListItemText, ListItemAvatar } from "@mui/material";
import { Fragment } from "react";

import { useReceipts } from "../../Lists/ListsApiQueries";
import { useMarkets } from "../../Markets/MarketsApiQueries";
import { formatEuro } from "../../Helpers/monetary";
import InfiniteList from "../../Helpers/InfiniteList";
import PersonAvatar from "../../Persons/Avatars";
import { isoToRelativeDate } from "../../Helpers/dateTime";


function ReceiptsListItem({ item, onSelect }) {
  const { getMarket } = useMarkets();

  const receiptName = item.name;
  const formattedDate = isoToRelativeDate(item.transaction_date);
  const eventCount = item.events.length;

  const secondaryInfo = [
    getMarket(item.market)?.name,
    `${eventCount} event` + (eventCount === 1 ? '' : 's'),
    `${item.item_count} items`,
    formatEuro(item.amount),
    formattedDate,
  ];

  return (
    <ListItemButton alignItems="flex-start" onClick={onSelect}>
      <ListItemAvatar>
        <PersonAvatar personId={item.payer} size={36} />
      </ListItemAvatar>
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
    </ListItemButton>
  );
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