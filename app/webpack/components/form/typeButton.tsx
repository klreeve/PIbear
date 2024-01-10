import React from 'react';

type typeButtonProps = {
    display: string,
    eventCode: string,
    handleClick: (display: string) => void,
    className: string
}

export const TypeButton = ({display, eventCode, handleClick, className}: typeButtonProps) => {

    return (
        <div className={`typeButton ${className}`} data-key={eventCode} data-type={display} onClick={() => handleClick(display)}>
            <p>{display}</p>
        </div>
    )

}