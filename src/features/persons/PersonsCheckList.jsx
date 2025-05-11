import SelectMultiple from "src/components/form/SelectMultiple";
import { usePersons } from "./api";
import { PersonNameTag } from "./PersonNameTag";


export function PersonsChecklist({ selected, setSelected }) {
    const { data } = usePersons();

    const persons = data || [];
    const options = persons.map(p => p.id);
    const renderOption = personId =>
        <PersonNameTag person={persons.find(p => p.id === personId)} />;

    return <SelectMultiple
        options={options}
        renderOption={renderOption}
        selected={selected}
        setSelected={setSelected}
    />;
}
