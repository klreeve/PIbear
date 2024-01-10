import React from "react"

import { ItemType } from "../../types";
import { ConfirmButton } from "./confirmButton";

export const ItemRow = ({item, handleDelete, handleEditClicked}: { item: ItemType, handleDelete: (id: number) => void, handleEditClicked: (item: ItemType) => void }) => {

    const getTime = (utcDatetime: string): string => {
        return new Date(utcDatetime).toLocaleTimeString('it-IT');
    }

    const getDate = (utcDatetime: string): string => {
        return new Date(utcDatetime).toLocaleDateString("en-US", {day: "2-digit", month: "2-digit"})
    }

    return (
        <tr className="item-row">
            <td>{ item.item_code }</td>
            <td>{ item.type }</td>
            <td>{ getTime(item.datetime) }</td>
            <td>{ getDate(item.datetime) }</td>
            <td>{ item.location }</td>
            <td><div className="comment-col">{ item.comments }</div></td>
            <td><div onClick={() => handleEditClicked(item)}><i className="icon-button fas fa-pencil-alt"></i></div></td>
            <td>
                <ConfirmButton
                    buttonDisplay={<i className="icon-button fas fa-trash-alt"></i>}
                    title="Delete Item"
                    message={`Are you sure you want to delete item ${item.item_code} created at ${getTime(item.datetime)} on ${getDate(item.datetime)}?`}
                    confirmText="Confirm"
                    cancelText="Cancel"
                    handleConfirm={() => {
                        handleDelete(item.id)
                    }}
                    className="delete-item"
                />
            </td>
        </tr>
    )
}