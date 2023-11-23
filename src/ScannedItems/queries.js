import axios from "axios";
import apiPath from "../Api/ApiPath";


export const fetchScannedItems = async ({ pageParam = 1 }) => {
    console.log(pageParam);
    let res
    if(pageParam === 1) {
        res = await fetch(`${apiPath}/scanneditems/?page=1`)
    } else {
        res = await fetch(pageParam)
    }
    return res.json()
}

export const getBarcodeProduct = async (barcode) => {
    return axios.get(`${apiPath}/products/?barcode=${barcode}`)
};
