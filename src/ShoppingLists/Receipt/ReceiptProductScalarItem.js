import { Box, Button, Chip, Grid, InputAdornment, InputBase, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { useListItemDeleter, useListItemMutator } from "../ShoppingListApiQueries";
import { useBrands } from "../../Brands/BrandsApiQueries";
import useUnitTypeInfo from "../../UnitTypes/UnitTypeInfo";



export default function ReceiptProductScalarItem({ item }) {
    const mutateListItem = useListItemMutator();
    const deleteListItem = useListItemDeleter();

    const product = item.product;

    const brandsQuery = useBrands();
    const brandName = brandsQuery.getBrand(product.brand)?.name;

    const isLoading = brandsQuery.isLoading;
    const isError = brandsQuery.isError;

    const { isLoading: isLoadingUnitTypes, isError: isErrorUnitTypes, unitTypeInfo } = useUnitTypeInfo();

    if (isLoading || isError || isLoadingUnitTypes || isErrorUnitTypes) {
        return <Skeleton />
    }

    const increaseQuantity = () => {
        mutateListItem({
            id: item.id,
            product_quantity: item.product_quantity + 1
        })
    }

    const disabledDecrease = (item.product_quantity === 1)
    const decreaseQuantity = () => {
        if ((item.product_quantity - 1) > 0) {
            mutateListItem({
                id: item.id,
                product_quantity: item.product_quantity - 1
            })
        }
    }

    const removeItem = () => {
        deleteListItem(item.id);
    };

    const unitType = unitTypeInfo(product.unit_type);

    const amountLabel = `${item.product_quantity} ${unitType.physical_unit}`

    return (

        <Box>
            <Box sx={{ my: 1, mx: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between"  >
                    <Grid container spacing={1} direction="row" item>
                        <Grid item sx={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}>

                            <Typography variant="h6" component="div" gutterBottom sx={{ m: 0 }}>
                                {product.name}
                            </Typography>


                        </Grid>
                        <Grid item sx={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}>
                            {/* <Box sx={{ bgcolor: 'primary.main', mt: 'auto' }}> */}
                            <Typography color="text.secondary" variant="body2" sx={{ m: 0.5 }}>
                                {brandName}
                            </Typography>
                            {/* </Box> */}

                        </Grid>
                    </Grid>

                    <Typography gutterBottom variant="h6" component="div">
                        €{product.unit_price}
                    </Typography>



                </Stack>

            </Box>
            <Box sx={{ mt: 1, mb: 2, ml: 2 }}>
                <Stack
                    direction="row"
                    spacing={2}
                    >
                <TextField
                    // fullWidth
                    // disabled={unitTypeInfo === null || formik.values.unit_type === 3}
                    sx={{ width: '100px' }}
                    size="small"
                    id="unit_weightvol"
                    name="unit_weightvol"
                    label="Gewicht"
                    variant="standard"
                    // value={formik.values.unit_type === 3 ? '' : formik.values.unit_weightvol}
                    //value={item.product_quantity}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    // onChange={formik.handleChange}
                    InputProps={{
                        endAdornment: <InputAdornment position="start">{unitType.physical_unit}</InputAdornment>,
                        disableUnderline: true
                    }}
                // error={
                //     formik.touched.unit_weightvol &&
                //     Boolean(formik.errors.unit_weightvol)
                // }
                // helperText={
                //     formik.touched.unit_weightvol && formik.errors.unit_weightvol
                // }
                />

                <TextField
                    // fullWidth
                    // disabled={unitTypeInfo === null || formik.values.unit_type === 3}
                    sx={{ width: '100px' }}
                    size="small"
                    id="unit_weightvol"
                    name="unit_weightvol"
                    label="Prijs per kilo"
                    variant="standard"
                    // value={formik.values.unit_type === 3 ? '' : formik.values.unit_weightvol}
                    value={product.unit_price.toFixed(2)}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    // onChange={formik.handleChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        disableUnderline: true
                    }}

                    
                // error={
                //     formik.touched.unit_weightvol &&
                //     Boolean(formik.errors.unit_weightvol)
                // }
                // helperText={
                //     formik.touched.unit_weightvol && formik.errors.unit_weightvol
                // }
                />

<TextField
                    // fullWidth
                    // disabled={unitTypeInfo === null || formik.values.unit_type === 3}
                    sx={{ width: '100px' }}
                    size="small"
                    id="unit_weightvol"
                    name="unit_weightvol"
                    label="Totaal prijs"
                    variant="standard"
                    // value={formik.values.unit_type === 3 ? '' : formik.values.unit_weightvol}
                    //value={item.product_quantity}
                    disabled
                    InputLabelProps={{
                        shrink: true,
                    }}
                    // onChange={formik.handleChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        disableUnderline: true
                    }}

                    
                // error={
                //     formik.touched.unit_weightvol &&
                //     Boolean(formik.errors.unit_weightvol)
                // }
                // helperText={
                //     formik.touched.unit_weightvol && formik.errors.unit_weightvol
                // }
                />
                
                {/* <Stack
                    direction="row"
                    spacing={2}
                >
                    <Button size="small" variant="contained" onClick={() => increaseQuantity()}>+</Button>
                    <Button size="small" variant="contained" disabled={disabledDecrease} onClick={() => decreaseQuantity()}>-</Button>
                    <Button size="small" variant="contained" color="error" onClick={removeItem} >Verwijder</Button>
                    <TextField
                        size="small"
                        label="Korting"
                        startAdornment={<InputAdornment position="start">- €</InputAdornment>}
                    />
                </Stack> */}
</Stack>

            </Box>
        </Box>
    )
}