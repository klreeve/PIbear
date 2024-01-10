import React from "react";

import { Partial, TableModsType } from "../../types";

type TableHeaderProps = {
    title: string,
    cols?: number,
    sort?: string,
    tableMods:  { sortBy: string, sortMod: string, page: number, search: string },
    updateTableMods: (updatedValues: Partial<TableModsType>) => void,
}

export const TableHeader = (props: TableHeaderProps ) => {
    const {title, cols, sort, tableMods, updateTableMods} = props;

    const DEFAULT_MOD = "asc";

    // Called when any of the table headers are clicked
    const handleClick = (newSort: string) => {
        if (newSort === tableMods.sortBy) {
            updateTableMods({sortMod: (tableMods.sortMod === "desc") ? "asc" : "desc"});
        } else {
            updateTableMods({sortBy: newSort, sortMod: DEFAULT_MOD});
        }
    }

    const getArrowClassName = (sortMod: string): string => {
        const asc: boolean = (sortMod === "asc");
        let className: string = asc ? "arrow-up" : "arrow-down";

        if ((tableMods.sortBy === sort) && (tableMods.sortMod === sortMod)) {
            className += asc ? " active-arrow-up" : " active-arrow-down";
        }

        return className;
    }



    return (
        <th colSpan={cols} data-sortable={(sort !== undefined)} onClick={sort ? () => handleClick(sort || "time") : undefined}>
            <div className={`column-header-container ${title === "Comments" ? "comment-col": ""}`}>
                <p>{title}</p>
                {sort &&
                <div className="sort-arrows">
                    <div className={getArrowClassName("asc")}></div>
                    <div className={getArrowClassName("desc")}></div>
                </div>}
            </div>
        </th>
    )
}