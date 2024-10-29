import SelectMultiple from "../Helpers/SelectMultiple";
import { usePersons } from "./PersonsApiQueries";
import PersonNameTag from "./PersonNameTag";


export default function SelectPersons({ selected, setSelected }) {
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
