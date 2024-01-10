import React, { useEffect } from 'react';

import axios from 'axios';

import { TableHeader } from "./tableHeader";
import { ItemRow } from "./itemRow";

import { ItemType, Partial, TableModsType } from "../../types";

import { ConfirmButton } from "./confirmButton";
import { DownloadMenu } from "./downloadMenu";
import { Search } from "./header/search";
import { PageNav } from "./header/pageNav";
import { RefreshButton } from "./header/refreshButton";

type TableProps = {
    updateTableMods: (updatedValues: Partial<TableModsType>) => void,
    handleEditClicked: (itemClicked: ItemType) => void,
    getData: () => void,
    tableMods:  { sortBy: string, sortMod: string, page: number, search: string}
    tableData: { items: ItemType[], pageInfo: {totalItems: number, totalPages: number}}
}


export const Table = ({updateTableMods, handleEditClicked, getData, tableMods, tableData}: TableProps) => {
    const config = require("../../../../config.json");

    const headerProps = [
        {sort: "item_code", title: config.itemName},
        {sort: "type", title: config.buttonsName},
        {sort: "time", title: "Date and Time", cols: 2},
        {sort: "location", title: "Location"},
        {sort: "comments", title: "Comments"},
        {title: "Actions", cols: 2}
    ];

    // items refresh on table mod change
    useEffect(() => {
        getData();
    }, [tableMods]);

    const handleDeleteAll = () => {handleDelete()};
    const handleDelete = (id?: number) => {
        const url = (id) ? `api/delete/${id}` : 'api/delete/all';
        axios.delete(url).then((response) => {
            getData();
        });
    };


    return (
        <div className="data-display">
            <div className="table-header">

                <div className="table-header-left">
                    <Search updateTableMods={updateTableMods}/>
                    <RefreshButton getData={getData}/>
                </div>

                <div className="table-header-right">
                    <div className="page-numbers">
                        <p>Displaying <span>{tableData.items.length}</span> of <span>{tableData.pageInfo.totalItems}</span></p>
                    </div>

                    <PageNav
                        page={tableMods.page}
                        updateTableMods={updateTableMods}
                        totalPages={tableData.pageInfo.totalPages}
                    />
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            {headerProps.map((currHeaderProps, currIndex) => (
                                <TableHeader
                                    key={currIndex}
                                    updateTableMods={updateTableMods}
                                    tableMods={tableMods}
                                    {...currHeaderProps}
                                />
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {tableData.items.map((currItem, currIndex) => (
                            <ItemRow key={currIndex} item={currItem} handleDelete={handleDelete} handleEditClicked={handleEditClicked}/>
                        ))}
                        <tr></tr>
                    </tbody>
                </table>
            </div>

            <div className="table-footer">
                <ConfirmButton
                    buttonDisplay="DELETE ALL"
                    className="delete-all submit-button"
                    title="Wipe Database"
                    message={`Are you sure you want to delete all items from the database? This action cannot be undone.`}
                    confirmText="Confirm"
                    cancelText="Cancel"
                    handleConfirm={() => {
                        handleDeleteAll()
                    }}
                />

                <DownloadMenu/>
            </div>
        </div>

    );
}