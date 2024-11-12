export function moveToFront(list, item) {
    const list2 = list.filter(it => it !== item);
    list2.unshift(item);
    return list2;
}

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
