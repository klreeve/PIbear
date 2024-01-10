import React from 'react'

import { Partial, TableModsType } from "../../../types";

export const PageNavBtn = ({updateTableMods, page, display}: {updateTableMods: (updatedValues: Partial<TableModsType>) => void, page: number, display?: any}) => {
    return (
        <a className={`page-box`} onClick={() => updateTableMods({page: page})}>{display || page}</a>
    )
}