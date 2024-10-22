import { useConfirm } from "material-ui-confirm";

import BrandsList from "./BrandsList";
import { useBrandDeleter } from "./BrandsApiQueries";
import ControllerView from "../Helpers/ControllerView";
import useUrlSearchQuery from "../Helpers/urlSearchQuery";


export default function BrandController({ onClose, onMenu }) {
    const [searchQuery, setSearchQuery] = useUrlSearchQuery();

    const deleteBrand = useBrandDeleter();

    const confirm = useConfirm();

    function handleDelete(brand) {
        confirm({
            title: "Weet je zeker dat je dit merk wilt verwijderen?",
            description: `${brand.name}`
        })
            .then(() => {
                deleteBrand(brand.id);
            })
            .catch(() => {
                
            });
    }

    return (
        <ControllerView
            title="Merken"
            initialSearch={searchQuery}
            handleNewSearch={setSearchQuery}
            onMenu={onMenu}
            onClose={onClose}
        >
            <BrandsList searchQuery={searchQuery} handleDelete={handleDelete} />
        </ControllerView>
    );
}
