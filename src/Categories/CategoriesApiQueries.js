import apiPath from "../Api/ApiPath";


export const fetchCategories = async ({ pageParam = 0, parentId }) => {
    let res
    const parentFilter = parentId ? `parent_id=${parentId}` : 'parent_id__isnull=true';
    if(pageParam === 0) {
        res = await fetch(`${apiPath}/products/?page=1&${parentFilter}`)
    } else {
        res = await fetch(pageParam)
    }
    return res.json()
}
