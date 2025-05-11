export function partition(array, predicate) {
    return array.reduce((parArray, current, i, arr) => {
        if (parArray.length > 0 && predicate(arr[i-1], current)) {
            parArray[parArray.length - 1].push(current);
        } else {
            parArray.push([current]);
        }
        return parArray;
    }, []);
}
