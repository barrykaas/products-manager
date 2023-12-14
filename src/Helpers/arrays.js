export function moveToFront(list, item) {
    const list2 = list.filter(it => it !== item);
    list2.unshift(item);
    return list2;
}
