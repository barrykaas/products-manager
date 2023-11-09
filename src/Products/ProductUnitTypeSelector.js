import { useQuery } from '@tanstack/react-query';
import { TextField, MenuItem } from "@mui/material";
import { getUnitTypesFn } from './ProductsApiQueries';

import { useState } from 'react';

export function useUnitType(unitType) {
  const { isLoading, isError, data, error } = useQuery(["unittypes"], getUnitTypesFn);
  const unitTypes = data?.data || [];

  if (unitType === "") {
    return { isLoading, isError, unitTypeInfo: "", error };
  }

  if (!isLoading && !isError && unitTypes.length > 0) {
    const foundUnitType = unitTypes.find(type => type.id === unitType);
    //console.log("foundUnitType", foundUnitType, unitType)
    return { isLoading, isError, unitTypeInfo: foundUnitType.physical_unit, error }
  }

  return { isLoading, isError, unitTypeInfo: "", error };
}




const UnitTypeSelector = ({ name, label, value, onChange, formik }) => {
  const { isLoading, isError, data, error } = useQuery(["unittypes"], getUnitTypesFn);
  const unitTypes = data?.data || [];

  return (
    <>
      <TextField
        className="px-2 my-2"
        variant="outlined"
        name={name}
        id={name}
        select
        label={label}
        value={value}
        onChange={onChange}
        fullWidth
        error={formik.touched[name] && Boolean(formik.errors[name])}
        helperText={formik.touched[name] && formik.errors[name]}
      >
        {unitTypes.map((unitType) => (
          <MenuItem key={unitType.id} value={unitType.id}>
            {unitType.type}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
};

export default UnitTypeSelector;