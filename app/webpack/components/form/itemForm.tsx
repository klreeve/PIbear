import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import { TypeButton } from "./typeButton";
import { TextInput } from "./textInput";

import { useObjState } from "../../customHooks";

type ItemFormProps = {
    itemInfo: {id: number, itemCode: string, type: string, comments: string}
    updateItemInfo: (updatedValues: object) => void,
    resetItemInfo: () => void,
    itemCodeRef: React.RefObject<HTMLInputElement>,
    getData: () => void,
}

export const ItemForm = ({itemInfo, updateItemInfo, resetItemInfo, itemCodeRef, getData}: ItemFormProps) => {
    const config = require("../../../../config.json");

    const itemCodeRegex = new RegExp(`^[A-Za-z0-9]{1,${config.itemCodeLength}}$`);
    const commentsRegex = /^[^./\\]{0,256}$/;

    const [validInput, updateValidInput] = useObjState({itemCode: true, comments: true})

    const typeButtonProps = [
        {display: "A", eventCode: "NumpadDivide"},
        {display: "B", eventCode: "NumpadMultiply"},
        {display: "C", eventCode: "NumpadSubtract"},
        {display: "D", eventCode: "NumpadAdd"},
    ];

    const getLocation = () => {
        const locationElements = Array.from(document.getElementsByClassName("location"));

        for (const el of locationElements) {
            const select = el.getElementsByTagName("select")[0];
            const location = select.options[select.selectedIndex].value;
            if (window.getComputedStyle(select).display !== "none") return location;
        }
    };

    // Called when editing or adding an item
    const handleSubmit = (submittedType: string) => {
        if (!itemCodeRegex.test(itemInfo.itemCode)) {
            updateValidInput({itemCode: false})
            return;
        }

        if (!commentsRegex.test(itemInfo.comments)) {
            updateValidInput({comments: false})
            return;
        }

        const cookies = new Cookies();
        const location = getLocation();
        const DAYS_TO_EXPIRE = 14;

        var expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + (DAYS_TO_EXPIRE*24*60*60*1000));

        cookies.set("location", location, {expires: expirationDate})

        if (itemInfo.id >= 0) {
            axios.put(`api/edit/${itemInfo.id}`, {
                code: itemInfo.itemCode,
                type: submittedType,
                comments: itemInfo.comments,
                location: location
            }).then(res => {
                getData();
            }).catch(error => {
                console.error(`ERROR: ${error.response.status} (${error.response.data})`);
                return;
            })
        } else {
            axios.post(`api/add/`, {
                code: itemInfo.itemCode,
                type: submittedType,
                time_added: Date.now(),
                comments: itemInfo.comments,
                location: location
            }).then(res => {
                getData();
            }).catch(error => {
                console.error(`ERROR: ${error.response.status} (${error.response.data})`);
            })
        }

        resetItemInfo();
        itemCodeRef.current?.focus();
    }

    return (
        <div className="form-container">
            <div className="inputs">
                <h1 className="input-title">Details</h1>
                <h1 className="input-title">{config.buttonsName}</h1>

                <div className="text-inputs">
                    <TextInput
                        type="itemCode"
                        placeholder={`${config.itemName} Code`}
                        value={itemInfo.itemCode}
                        updateItemInfo={updateItemInfo}
                        handleSubmit={handleSubmit}
                        validationRegex={itemCodeRegex}
                        maxLength={config.itemCodeLength}
                        autofocus={true}
                        ref={itemCodeRef}
                        valid={validInput.itemCode}
                    />

                    <TextInput
                        type="comments"
                        placeholder="Comments"
                        value={itemInfo.comments}
                        updateItemInfo={updateItemInfo}
                        handleSubmit={handleSubmit}
                        validationRegex={commentsRegex}
                        maxLength={256}
                        valid={validInput.comments}
                    />
                </div>


                <div className="type-buttons">
                    {typeButtonProps.map((currTypeButtonProps, currIndex) => {
                        return <TypeButton
                            key={currIndex}
                            handleClick={handleSubmit}
                            {...currTypeButtonProps}
                            className={itemInfo.type === currTypeButtonProps.display ? "active-type" : ""}
                        />
                    })}

                </div>

            </div>

            <div className="cancel errors">

            </div>
        </div>
    )
}