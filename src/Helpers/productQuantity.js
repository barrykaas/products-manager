import { formatEuro } from "./monetary";


export function formatProductQuantity({ unit, volume, pieces }) {
    const piecesStr = pieces ? `${pieces} stuk` + (pieces === 1 ? '' : 's') : '';
    const volumeStr = volume ? `${volume} ${unit}` : '';

    if (pieces && volume) {
        if (pieces === 1) {
            return volumeStr;
        } else {
            return piecesStr + ', totaal ' + volumeStr;
        }
    } else if (pieces) {
        return piecesStr;
    } else {
        return volumeStr;
    }
}

const unitMap = {
    'g': 'kg',
    'mL': 'L',
    'm': 'm'
}

export function formatPricePerUnit({ unit, volumeOrPieces, price }) {
    const newUnit = unit ? unitMap[unit] : 'st.';
    let ppu = price / volumeOrPieces;
    if (unit === 'g' || unit === 'mL') ppu *= 1000;
    return formatEuro(ppu) + '/' + newUnit;
}
