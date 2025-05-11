import { useContext, useEffect } from "react";

import { PageTitleContext } from "../context/PageTitle";


export const usePageTitle = (initialTitle = '') => {
    const setPageTitle = useContext(PageTitleContext);
    useEffect(() => setPageTitle(initialTitle));

    return setPageTitle;
};
