import React, { useState, useEffect } from "react";

export const Clock = () => {
    const getCurrentTime = (): string => {
        const appendZero = (time: number) => { return (time < 10) ? "0" + time.toString() : time.toString(); }
        const today = new Date();
        return today.getHours() + ":" + appendZero(today.getMinutes()) + ":" + appendZero(today.getSeconds());
    }

    const [currentTime, setCurrentTime] = useState(getCurrentTime());

    useEffect(() => {
        const clock = setTimeout(() => {
            setCurrentTime(getCurrentTime());
        }, 1000);
    });
    return <div id="clock">{currentTime}</div>
}