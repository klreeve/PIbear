import React from 'react'

import { Partial, TableModsType } from "../../../types";

export const Search = ({updateTableMods}: {updateTableMods: (updatedValues: Partial<TableModsType>) => void,}) => {
    return (
        <div className="has-search">
            <span className="fas fa-search icon"></span>
            <input className="search-field" type="text" placeholder="Search" onChange={(e) => (e.target.value !== "/") ? updateTableMods({search: e.target.value}) : null}></input>
        </div>

    )
}