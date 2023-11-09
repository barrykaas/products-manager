import { useEffect, useState } from 'react';

import apiPath from '../../Api/ApiPath';

function useShoppingListTypes() {
    const [listTypes, setListTypes] = useState([]);

    useEffect(() => {
        fetch(`${apiPath}/listtypes`)
            .then(response => response.json())
            .then(data => setListTypes(data))
            .catch(error => console.error(error));
    }, []);
    
    return (listTypes);
}

export default useShoppingListTypes;