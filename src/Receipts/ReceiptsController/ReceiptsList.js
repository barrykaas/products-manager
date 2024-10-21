import { Typography, ListItemButton, ListItemText, ListItemAvatar, CircularProgress, Stack, Box, Badge } from "@mui/material";
import { Fragment } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { useMarkets } from "../../Markets/MarketsApiQueries";
import { formatEuro } from "../../Helpers/monetary";
import InfiniteList from "../../Helpers/InfiniteList";
import PersonAvatar from "../../Persons/Avatars/Avatars";
import { isoToRelativeDate } from "../../Helpers/dateTime";
import { linkOrOnClick } from "../../Helpers/linkOrOnClick";
import { useSettings } from "../../Settings/settings";
import IdLabel from "../../Common/IdLabel";
import { apiLocations, usePaginatedQuery } from "../../Api/Common";
import { searchParamsToObject } from "../../Helpers/searchParams";


export function ReceiptsListItem({ item, onSelect, linkTo, ...props }) {
  const [{ nerdInfo }] = useSettings();
  const { getMarket } = useMarkets();
  if (!item) return <CircularProgress />;

  const receiptName = item.name;
  const formattedDate = isoToRelativeDate(item.date);
  const eventCount = item.event_count;
  const amount = item.total;

  const secondaryInfo = [
    formattedDate,
    getMarket(item.market)?.name,
    `${eventCount} event` + (eventCount === 1 ? '' : 's'),
    `${item.item_count} items`,
  ];

  const market = getMarket(item.market);

  return (
    <ListItemButton alignItems="flex-start" divider
      onClick={onSelect}
      component={Link}
      to={!!onSelect || linkTo || `/receipts/${item.id}`}
      {...props}
    >
      <ListItemAvatar>
        <ReceiptAvatar payerId={item.payer} market={market} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Stack direction="row" spacing={1}>
            {nerdInfo &&
              <IdLabel id={item.id} />
            }
            <Typography>{receiptName}</Typography>
            <Box sx={{ flexGrow: 1 }} />
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
  const [searchParams] = useSearchParams();
  const {
    data,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    fetchNextPage
  } = usePaginatedQuery({
    queryKey: [apiLocations.receipts,
      {
        search: searchQuery,
        page_size: 20,
        ...searchParamsToObject(searchParams)
      }
    ]
  });

  const allReceipts = data?.pages.flatMap((page) => page.results) || [];

  return (
    <InfiniteList onMore={fetchNextPage} hasMore={hasNextPage}
      isLoading={isFetching || isFetchingNextPage}
      error={isError ? error : null}
    >
      {allReceipts.map((item) => (
        <Fragment key={item.id}>
          <ReceiptsListItem item={item}
            {...linkOrOnClick(onSelectItem(item))}
          />
        </Fragment>
      ))}
    </InfiniteList>
  );

}


function ReceiptAvatar({ payerId, market }) {
  if (!payerId) return;

  return (
    <Badge
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        market?.image &&
        <img src={market?.image} alt={market?.name} width={22} />
      }
    >
      <PersonAvatar personId={payerId} size={36} />
    </Badge>
  );
}
