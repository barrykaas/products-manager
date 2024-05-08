import { Container } from "@mui/material";
import MainNav from "./MainNav";


export default function Root() {
    return (
        <Container
            maxWidth={false}
            disableGutters
        >
            <MainNav />
        </Container>
    );
}
