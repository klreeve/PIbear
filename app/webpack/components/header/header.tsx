import React, {useEffect, useState} from "react";
import Cookies from "universal-cookie"

import { LocationSelect } from "./locationSelect";
import { ToggleButton } from "./toggleButton";
import { Clock } from "./clock";

import { Partial, ItemInfoType } from "../../types";

type HeaderProps = {
    currentLocationCode: string,
    updateItemInfo: (updatedValues: Partial<ItemInfoType>) => void

}
export const Header = ({currentLocationCode, updateItemInfo}: HeaderProps) => {

    const cookies = new Cookies();
    const [highContrast, setHighContrast] = useState(cookies.get("highContrast") == "true");


    const onToggleClicked = () => {
        const DAYS_TO_EXPIRE = 14;
        var date = new Date();
        date.setTime(date.getTime() + (DAYS_TO_EXPIRE*24*60*60*1000));
        cookies.set("highContrast", !highContrast, {expires: date});

        setHighContrast(!highContrast);
        document.body.classList.toggle("high-contrast-body");
    }

    return (
        <div className="header-container">
            <LocationSelect
                side="left"
                currentLocationCode={currentLocationCode}
                updateItemInfo={updateItemInfo}
            />

            <div className="right-side">
                <Clock/>

                <div>
                    <ToggleButton
                        checked={highContrast}
                        handleClick={onToggleClicked}
                        className="high-contrast-switch"
                        display="High Contrast Mode"
                        smallDisplay="HCM"
                    />
                    <LocationSelect
                        side="right"
                        currentLocationCode={currentLocationCode}
                        updateItemInfo={updateItemInfo}
                    />
                </div>

            </div>

        </div>
    )
}