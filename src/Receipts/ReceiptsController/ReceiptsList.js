import { Typography, ListItemButton, ListItemText, ListItemAvatar, CircularProgress, Stack } from "@mui/material";
import { Fragment } from "react";

import { useReceipts } from "../../Lists/ListsApiQueries";
import { useMarkets } from "../../Markets/MarketsApiQueries";
import { formatEuro } from "../../Helpers/monetary";
import InfiniteList from "../../Helpers/InfiniteList";
import PersonAvatar from "../../Persons/Avatars/Avatars";
import { isoToRelativeDate } from "../../Helpers/dateTime";


export function ReceiptsListItem({ item, onSelect, ...args }) {
  const { getMarket } = useMarkets();
  if (!item) return <CircularProgress />;

  const receiptName = item.name;
  const formattedDate = isoToRelativeDate(item.transaction_date);
  const eventCount = item.events.length;
  const amount = item.amount;

  const secondaryInfo = [
    formattedDate,
    getMarket(item.market)?.name,
    `${eventCount} event` + (eventCount === 1 ? '' : 's'),
    `${item.item_count} items`,
  ];

  return (
    <ListItemButton alignItems="flex-start" onClick={onSelect} divider
      {...args}
    >
      <ListItemAvatar>
        <PersonAvatar personId={item.payer} size={36} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Stack direction="row" justifyContent="space-between" spacing={1}>
            <Typography>{receiptName}</Typography>
            {amount !== 0 &&
              <Typography align="right" sx={{ whiteSpace: "nowrap" }}><b>{formatEuro(amount)}</b></Typography>
            }
          </Stack>
        }
        secondaryTypographyProps={{ component: "div" }}
        secondary={secondaryInfo.filter(Boolean).join(" - ")}
      />
    </ListItemButton>
  );
}

export default function ReceiptsList({ onSelectItem, searchQuery }) {
  const {
    data,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    fetchNextPage
  } = useReceipts({ params: { search: searchQuery, page_size: 20 } });

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
        </Fragment>
      ))}
    </InfiniteList>
  );

}
