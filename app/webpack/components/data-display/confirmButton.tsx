import React from 'react';

import { confirmAlert } from 'react-confirm-alert';

type confirmButtonProps = {
    buttonDisplay: any,
    title: string,
    message: string,
    confirmText: string,
    handleConfirm: () => void,
    cancelText: string
    handleCancel?: () => void,
    className?: string
};

export const ConfirmButton = (props: confirmButtonProps) => {
    const {buttonDisplay, title, message, confirmText, cancelText, handleConfirm, handleCancel, className} = props;
    const submit = () => {
        confirmAlert({
            title: title,
            message: message,
            buttons: [
                {
                    label: confirmText,
                    onClick: () => handleConfirm()
                },
                {
                    label: cancelText,
                    onClick: handleCancel ? () => handleCancel() : () => null
                }
            ]
        });
    };



    return (
        <div className="container">
            <a className={`${className}`} onClick={submit}>{buttonDisplay}</a>
        </div>
    )
}