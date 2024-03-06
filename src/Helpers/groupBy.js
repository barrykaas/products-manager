/**
 * @param {Array} list List of objects with property `property`.
 * @param {*} property `property` to group by.
 * @returns Object with object[val] = [element | element[property] = val]
 */
export default function groupByProperty(list, property) {
    const keys = [];
    const grouped = {};
    list.forEach(element => {
        const key = element[property];
        if (!keys.includes(key)) {
            keys.push(key);
            grouped[key] = [];
        }
        grouped[key].push(element);
    });
    return [grouped, keys];
}
