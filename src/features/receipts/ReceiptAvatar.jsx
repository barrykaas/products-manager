import { ReceiptLong } from "src/components/icons";
import { Avatar, Badge } from "@mui/material";

import { PersonAvatar } from "../persons";
import { useMarket } from "../markets";


export default function ReceiptAvatar({ receipt }) {
    const marketId = receipt?.market;
    const payerId = receipt?.payer;
    const market = useMarket(marketId).data;

    if (!payerId) return (
        <Avatar>
            <ReceiptLong />
        </Avatar>
    );

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
