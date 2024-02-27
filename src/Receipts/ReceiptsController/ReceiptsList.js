import { Divider, Typography, ListItemButton, ListItemText, ListItemAvatar, CircularProgress, Box, Stack } from "@mui/material";
import { Fragment } from "react";
import { FixedSizeList } from 'react-window';
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";

import { useReceipts } from "../../Lists/ListsApiQueries";
import { useMarkets } from "../../Markets/MarketsApiQueries";
import { formatEuro } from "../../Helpers/monetary";
import InfiniteList from "../../Helpers/InfiniteList";
import PersonAvatar from "../../Persons/Avatars";
import { isoToRelativeDate } from "../../Helpers/dateTime";


function ReceiptsListItem({ item, onSelect, ...args }) {
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
    <ListItemButton alignItems="flex-start" onClick={onSelect} {...args}>
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
  } = useReceipts({ params: { search: searchQuery } });

  const allReceipts = data?.pages.flatMap((page) => page.results) || [];
  const itemCount = data?.pages?.at(0)?.count ?? 0;
  // const itemCount = allReceipts.length;
  // console.log('fetched length', allReceipts.length);


  const Row = ({ index, style }) => {
    if (index >= allReceipts.length) {
      console.log(`Row ${index}/${allReceipts.length}`);
    }
    const item = allReceipts[index];
    return (
      <ReceiptsListItem
        item={item}
        style={style}
        onSelect={() => onSelectItem(item)}
      />
    );
  }

  // return (
  //   <AutoSizer>
  //     {({ height, width }) =>
  //       <InfiniteLoader
  //         isItemLoaded={index => index < allReceipts.length}
  //         itemCount={itemCount}
  //         loadMoreItems={fetchNextPage}
  //       >
  //         {({ onItemsRendered, ref }) => (
  //           <FixedSizeList
  //             height={height}
  //             width={width}
  //             itemCount={itemCount}
  //             itemSize={80}
  //             onItemsRendered={onItemsRendered}
  //             ref={ref}
  //           >
  //             {Row}
  //           </FixedSizeList>
  //         )}
  //       </InfiniteLoader>
  //     }

  //   </AutoSizer>
  // )

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