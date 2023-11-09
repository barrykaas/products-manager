import React, {useState} from 'react';
import { Typography, AppBar, Toolbar, IconButton, Button, Dialog, Pagination, Box, CircularProgress, useMediaQuery } from '@mui/material';
import ShoppingListsAppBar from './ShoppingListsAppBar';
import Slide from '@mui/material/Slide';
import { ShoppingListCreateForm, ShoppingListEditForm } from './ShoppingListForm';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingLists from './ShoppingLists';
import useShoppingListTypes from './Helpers/ShoppingListTypes';

import FormDialog from '../Helpers/FormDialog';
import { useInfiniteQuery } from '@tanstack/react-query';

import apiPath from '../Api/ApiPath';

function ShoppingsListsController() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchShoppingLists = async ({ pageParam = 0 }) => {
        let res
        if(pageParam === 0) {
            res = await fetch(`${apiPath}/lists/?page=1`)
        } else {
            res = await fetch(pageParam)
        }
        return res.json()
      }
    
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['shoppinglists'],
        queryFn: fetchShoppingLists,
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
            
            <FormDialog
                open={open}
                onClose={handleClose}
                title={"Voeg lijst toe"}
            >
                <ShoppingListCreateForm didSuccesfullyCreate={() => {setOpen(false)}} listTypes={listTypes}/>
            </FormDialog>

            <FormDialog
                open={openEditor}
                onClose={handleEditorClose}
                title={ currentEditingItem.length != 0 
                    ? <> Aanpassen van {currentEditingItem[0].name} </>
                    : <> Laden </>
                    }
            >
                { currentEditingItem.length != 0 
                    ? <ShoppingListEditForm didSuccesfullyEdit={() => {handleEditorClose()}} listTypes={listTypes} item={currentEditingItem[0]} />
                    : <> Laden </>
                }
            </FormDialog>
        </>
    );
}

export default ShoppingsListsController;
