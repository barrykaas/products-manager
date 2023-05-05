import React, {useState} from 'react';
import { Typography, AppBar, Toolbar, IconButton, Button, Dialog, Pagination, Box, CircularProgress, useMediaQuery } from '@mui/material';
import ShoppingListsAppBar from './ShoppingListsAppBar';
import Slide from '@mui/material/Slide';
import { ShoppingListCreateForm, ShoppingListEditForm } from './ShoppingListForm';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingLists from './ShoppingLists';
import useShoppingListTypes from './Helpers/ShoppingListTypes';

import {useInfiniteQuery } from '@tanstack/react-query'
import { useTheme } from '@emotion/react';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const TransitionRight = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });

function ShoppingsListsController() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchProjects = async ({ pageParam = 0 }) => {
        let res
        if(pageParam === 0) {
            res = await fetch('https://django.producten.kaas/api/lists/?page=1')
        } else {
            res = await fetch(pageParam)
        }
        return res.json()
      }
    
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
        refetch
    } = useInfiniteQuery({
        queryKey: ['shoppinglists'],
        queryFn: fetchProjects,
        getNextPageParam: (lastPage, pages) => lastPage['next'],
    })

    const listTypes = useShoppingListTypes();

    const [editingId, setEditingId] = useState(null);

    const [openEditor, setOpenEditor] = useState(false);

    let shoppingListView;
    let currentEditingItem = [];

    const onSelectList = (id) => {
        console.log("OPEOPfiehhfeouu");
        setEditingId(id);
        setOpenEditor(true);
    };

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    if (isFetching) {
        shoppingListView = <CircularProgress />
    } else {
        const shoppinglistsdata = data.pages.flatMap((page) => (page.results));
        currentEditingItem = shoppinglistsdata.filter(item => item.id === editingId);
        shoppingListView = <ShoppingLists lists={shoppinglistsdata} listTypes={listTypes} onSelectList={onSelectList}/>
    }

    const handleEditorClose = () => {
        setOpenEditor(false);
    };

    return (
        <>
            <ShoppingListsAppBar handleAddButton={handleClickOpen} />
            
            {shoppingListView}
            <Button disabled={!hasNextPage || isFetchingNextPage} onClick={() => fetchNextPage()}>Load more</Button>
            
            
            <Dialog
                //fullScreen
                fullScreen={fullScreen}
                open={open}
                fullWidth={true}
                onClose={handleClose}
                maxWidth='sm'
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Voeg lijst toe
                        </Typography>
                        {/* <Button autoFocus color="inherit" onClick={handleClose}>
                            save
                        </Button> */}

                        
                    </Toolbar>
                </AppBar>
                
                <ShoppingListCreateForm didSuccesfullyCreate={() => {setOpen(false)}} listTypes={listTypes}/>
            </Dialog>

            <Dialog
                fullScreen={fullScreen}
                fullWidth={true}
                open={openEditor}
                maxWidth='sm'
                onClose={handleEditorClose}
                TransitionComponent={TransitionRight}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleEditorClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            { currentEditingItem.length != 0 
                            ? <> Aanpassen van {currentEditingItem[0].name} </>
                            : <> Laden </>
                            }
                        </Typography>
                        
                    </Toolbar>
                </AppBar>
                { currentEditingItem.length != 0 
                    ? <ShoppingListEditForm didSuccesfullyEdit={() => {handleEditorClose()}} listTypes={listTypes} item={currentEditingItem[0]} />
                    : <> Laden </>
                }
            </Dialog>
        </>
    );
}

export default ShoppingsListsController;
