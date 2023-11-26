import { Card, Grid, CardContent, Typography } from "@mui/material";

import { useCategories } from "./CategoriesApiQueries";


function CategoryCard({ category, onClick }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {`${category.id}: ${category.name}`}
                </Typography>
            </CardContent>
        </Card>
    );
}


export default function CategoriesList({ handleSelect }) {
    const categoriesQuery = useCategories();

    if (categoriesQuery.isLoading || categoriesQuery.isError) {
        return <div>Loading / error</div>;
    }

    const categoriesList = categoriesQuery.data.pages.flatMap((page) => page.results);

    return (
        <Grid container spacing={1}>
            {categoriesList.map((item) => (
                <Grid item xs={6} key={item.id}>
                    <CategoryCard category={item} onClick={() => handleSelect(item)} />
                </Grid>
            ))}
        </Grid>
    );
}
