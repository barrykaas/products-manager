import { AppBar, Container, Fab, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { useOutletContext } from "react-router";

import { Add, ArrowBack, Close, FilterAlt, Refresh, Menu } from "src/components/icons";
import { linkOrOnClick } from "src/utils/linkOrOnClick";
import { usePageTitle } from "src/hooks/usePageTitle";
import SearchBar from "./SearchBar";


export default function Page({
    children,
    title,
    onClose,
    onBack,
    onAdd,
    onRefresh,
    onFilter,
    initialSearch,
    handleNewSearch,
    maxWidth = "md",
    pb = 20,
    dialog,
    appBarSecondary,
}) {
    usePageTitle(title);

    return (
        <>
            <AppBar
                position="sticky"
            >
                <Toolbar>
                    <CloseButton onBack={onBack} onClose={onClose} />
                    {!handleNewSearch &&
                        <Typography
                            variant="h6"
                            component="div"
                        >
                            {title}
                        </Typography>
                    }
                    {!!handleNewSearch &&
                        <SearchBar
                            placeholder={title ? 'Zoek in ' + title : 'Zoek'}
                            handleNewSearch={handleNewSearch}
                            initialSearch={initialSearch}
                            onFilter={onFilter}
                        />
                    }
                </Toolbar>
                {appBarSecondary &&
                    <Toolbar variant="dense" >
                        {appBarSecondary}
                    </Toolbar>
                }
            </AppBar>
            <Container
                disableGutters
                maxWidth={maxWidth}
                sx={{ pb: !dialog ? pb : undefined }}
            >
                {children}
            </Container>

            <Stack
                spacing={1}
                alignItems="center"
                sx={{
                    position: "sticky",
                    bottom: "20px",
                    right: "20px",
                    width: 'max-content',
                    ml: 'auto'
                }}
            >
                {onFilter &&
                    <Fab size="small" color="secondary" {...linkOrOnClick(onFilter)}>
                        <FilterAlt />
                    </Fab>
                }
                {onRefresh &&
                    <Fab size="small" {...linkOrOnClick(onRefresh)}>
                        <Refresh />
                    </Fab>
                }
                {onAdd &&
                    <Fab color="primary" {...linkOrOnClick(onAdd)}>
                        <Add />
                    </Fab>
                }
            </Stack>
        </>
    );
}


function CloseButton({ onClose, onBack }) {
    const { onMenu } = useOutletContext();

    if (!onClose && !onBack) return (
        <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            {...linkOrOnClick(onMenu)}
            sx={{ mr: 1, display: { sm: 'none' } }}
        >
            <Menu />
        </IconButton>
    );
    if (onClose) return (
        <IconButton
            edge="start"
            {...linkOrOnClick(onClose)}
            sx={{ mr: 1 }}
        >
            <Close />
        </IconButton>
    );
    if (onBack) return (
        <IconButton
            edge="start"
            {...linkOrOnClick(onBack)}
            sx={{ mr: 1 }}
        >
            <ArrowBack />
        </IconButton>
    );
}
