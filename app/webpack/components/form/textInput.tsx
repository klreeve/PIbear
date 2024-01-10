import React, { forwardRef } from "react";

import { Partial, ItemInfoType } from "../../types";

type TextInputProps = {
    placeholder: string,
    type: string
    value: string,
    updateItemInfo: (updatedValues: Partial<ItemInfoType>) => void,
    handleSubmit: (submittedType: string) => void,
    validationRegex: RegExp,
    maxLength: number,
    valid?: boolean,
    autofocus?: boolean
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props: TextInputProps, ref) => {
    const {placeholder, type, value, updateItemInfo, handleSubmit, validationRegex, maxLength, valid = true, autofocus = false} = props;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === "Enter" || e.code === "NumpadEnter") e.preventDefault();

        const typeButtons = document.querySelectorAll(`[data-key="${e.code}"]`);
        if (typeButtons.length === 1) {
            e.preventDefault();
            handleSubmit(typeButtons[0].getAttribute("data-type")!)
            return;
        }

        if (!validationRegex.test(value + e.key)) {
            e.preventDefault();
            return;
        }
    };

    const validClass = (!valid || (value.length > maxLength)) ? "invalid" : "";

    return (
        <div className={`text-input-container`}>
            <input
                className={validClass}
                autoFocus={autofocus}
                placeholder={placeholder}
                size={32}
                onKeyPress={(e) => handleKeyDown(e)}
                type="text"
                ref={ref}
                value={value}
                onChange={(e) => updateItemInfo({[type]: e.target.value})}
            />
        </div>
    )
});