import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";

import { Partial, ItemInfoType } from "../../types";

type LocationSelectProps = {
    side: string,
    currentLocationCode: string,
    updateItemInfo: (updatedValues: Partial<ItemInfoType>) => void
}

export const LocationSelect = ({side, currentLocationCode, updateItemInfo}: LocationSelectProps) => {

    type LocationType = { name: string, code: string };
    const [locations, setLocations] = useState([] as LocationType[])

    useEffect(() => {
        axios.get("api/locations").then(result => {
            setLocations(result.data);
        })
    }, [])

    const handleChangeLocation = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const updatedLocationCode = e.target.options[e.target.selectedIndex].value
        updateItemInfo({location: updatedLocationCode})
        const cookies = new Cookies()

        const DAYS_TO_EXPIRE = 14;
        var date = new Date();
        date.setTime(date.getTime() + (DAYS_TO_EXPIRE*24*60*60*1000));
        cookies.set("location", updatedLocationCode, {expires: date})
    }

    return (
        <div className={`location ${side}`}>
            <div className="location-title-row">
                <label htmlFor="location">Locations</label>
                <a className="location-edit" href="/locations/"><i className="fas fa-edit"></i></a>
            </div>
            <div className="select">
                <select id={`location ${side}`} name="location"  value={currentLocationCode} onChange={(e) => handleChangeLocation(e)}>
                    {locations.map(location => (
                        <option key={location.code} value={location.code}>{location.name}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}