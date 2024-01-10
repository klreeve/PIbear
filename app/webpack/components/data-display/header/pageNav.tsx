import React from "react";

import { Partial, TableModsType } from "../../../types";

import { PageNavBtn } from "./pageNavBtn";

type PageNavProps = {
    page: number,
    updateTableMods: (updatedValues: Partial<TableModsType>) => void,
    totalPages: number
}

export const PageNav = ({ page, updateTableMods, totalPages }: PageNavProps) => {
    const leftArrow = <i className="fas fa-angle-left"></i>
    const rightArrow = <i className="fas fa-angle-right"></i>

    let limit = 2;
    const pageLinks = [] as number[]

    if (page === 1 || page === totalPages) {
        limit = 4;
    } else if (page === 2 || page === totalPages - 1) {
        limit = 3;
    }

    for (let currPage = 1; currPage <= totalPages; currPage++) {
        if (Math.abs(currPage - page) <= limit) pageLinks.push(currPage)
    }

    return (
        <div className="table-nav">
            <div className="table-nav-arrows-left">
                {page > 1 ?
                    <PageNavBtn
                        page={1}
                        display={<span>{leftArrow}{leftArrow}</span>}
                        updateTableMods={updateTableMods}
                    /> : <p className="page-box">{leftArrow}{leftArrow}</p>}
                {page > 1 ?
                    <PageNavBtn
                        page={page - 1}
                        display={leftArrow}
                        updateTableMods={updateTableMods}
                    /> : <p className="page-box">{leftArrow}</p>}
            </div>

            <div className="page-nav-boxes">
                {pageLinks.map((pageLink, index) => (pageLink !== page ?
                    <PageNavBtn
                        key={index}
                        page={pageLink}
                        updateTableMods={updateTableMods}
                    /> : <p key={index} className="current-page-box page-box">{pageLink}</p>
                ))}
            </div>

            <div className="table-nav-arrows-right">
                {page < totalPages ?
                    <PageNavBtn
                        page={page + 1}
                        display={rightArrow}
                        updateTableMods={updateTableMods}
                    /> : <p className="page-box">{rightArrow}</p>}

                {page < totalPages ?
                    <PageNavBtn
                        page={totalPages}
                        display={<span>{rightArrow}{rightArrow}</span>}
                        updateTableMods={updateTableMods}
                    /> : <p className="page-box">{rightArrow}{rightArrow}</p>}
            </div>

        </div>
    )
}