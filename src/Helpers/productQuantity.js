export function formatProductQuantity({ unit, volume, pieces }) {
    // let piecesStr = '', volumeStr = '';

    // if (pieces) {
        const piecesStr = pieces ? `${pieces} stuk` + (pieces === 1 ? '' : 's') : '';
    // }

    // if (volume) {
        const volumeStr = volume ? `${volume} ${unit}` : '';
    // }

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
