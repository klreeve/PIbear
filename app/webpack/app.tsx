import React, { useEffect, createRef } from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

import { Table } from "./components/data-display/table";
import { ItemForm } from "./components/form/itemForm";
import { Header } from "./components/header/header";

import { ItemType, TableModsType, ItemInfoType } from "./types";
import { useObjState, useDefaultObjState} from "./customHooks"

const App = () => {

    // Search and sorting state
    const [tableMods, updateTableMods] = useObjState<TableModsType>({
        sortBy: "time",
        sortMod: "desc",
        page: 1,
        search: "",
    });

    // Item information state
    const [tableData, setTableData] = useObjState({
        items: [] as ItemType[],
        pageInfo: {totalItems: 0, totalPages: 0}
    })

    // Editing item state
    const cookies = new Cookies();
    const [itemInfo, updateItemInfo, resetItemInfo] = useDefaultObjState<ItemInfoType>({
        id: -1,
        itemCode: "",
        type: "",
        comments: "",
        location: cookies.get("location")
    });

    // Refreshes items in table
    const getData = () => {
        const url = (tableMods.search !== "") ?
            `api/search/${tableMods.search}/${tableMods.sortBy}:${tableMods.sortMod}/${tableMods.page}` :
            `api/items/${tableMods.sortBy}:${tableMods.sortMod}/${tableMods.page}`;

        axios.get(url).then(result => {
            setTableData({items: result.data.items, pageInfo: result.data.pageInfo})
            if (result.data.pageInfo.totalPages < tableMods.page) updateTableMods({page: result.data.pageInfo.totalPages});
        })
    };

    // Ensures current page is never 0 when there is more than 0 pages
    useEffect(() => {
        if (tableData.pageInfo.totalPages > 0 && tableMods.page < 1) updateTableMods({page: 1});
    }, [tableData])

    // Prepares the form to edit an item
    const itemCodeRef = createRef<HTMLInputElement>();
    const handleEditClicked = (itemClicked: ItemType) => {
        updateItemInfo({
            id: itemClicked.id,
            itemCode: itemClicked.item_code.toString(),
            type: itemClicked.type,
            comments: itemClicked.comments,
            location: itemClicked.location
        });

        itemCodeRef.current?.focus();
    };

    const config = require("../../config.json");

    return (
        <div className="react-content">
            <header>
                <Header
                    currentLocationCode={itemInfo.location}
                    updateItemInfo={updateItemInfo}
                />
            </header>

            <section className="item-input section-dark">
                {/* <div className="title-container">
                    <h1 className="title">{itemInfo.id >= 0 ? `Edit ${config.itemName}` : `Add ${config.itemName}`}</h1>
                </div> */}
                <ItemForm
                    itemInfo={itemInfo}
                    updateItemInfo={updateItemInfo}
                    resetItemInfo={resetItemInfo}
                    itemCodeRef={itemCodeRef}
                    getData={getData}
                />
            </section>

            <section className="data-display-container">
                <Table
                    tableMods={tableMods}
                    tableData={tableData}
                    getData={getData}
                    updateTableMods={updateTableMods}
                    handleEditClicked={handleEditClicked}
                    />
            </section>
        </div>
    )
}

// Setup

const RootComponent = () => {
    return <App/>
}

const entry = document.getElementById("app-root")
ReactDom.render(<RootComponent/>, entry)