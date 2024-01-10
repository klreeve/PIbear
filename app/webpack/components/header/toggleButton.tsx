import React from "react";

type toggleButtonProps = {
    checked: boolean,
    className: string,
    display: string,
    smallDisplay?: string,
    handleClick: () => void
}

export const ToggleButton = ({checked, className, display, smallDisplay, handleClick}: toggleButtonProps) => {


    return (
        <div className={className}>
            <p className="longTitle">{display}</p>
            <p className="shortTitle">{smallDisplay ? smallDisplay : display}</p>
            <div className="switch">
                <input id="cmn-toggle-1" className="cmn-toggle cmn-toggle-round" type="checkbox" checked={checked} onChange={() => handleClick()}/>
                <label htmlFor="cmn-toggle-1"></label>
            </div>
        </div>
    )
}