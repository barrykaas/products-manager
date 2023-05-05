import { useEffect, useState } from 'react';


function useShoppingListTypes() {
    const [listTypes, setListTypes] = useState([]);

    useEffect(() => {
        fetch('https://django.producten.kaas/api/listtypes')
            .then(response => response.json())
            .then(data => setListTypes(data))
            .catch(error => console.error(error));
    }, []);
    
    return (listTypes);
}

export default useShoppingListTypes;