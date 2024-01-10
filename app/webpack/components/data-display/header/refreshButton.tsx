import React from "react";

export const RefreshButton = ({getData}: {getData: () => void}) => {
    return (
        <a className="refresh-button" onClick={() => getData()}>
            <i className="fas fa-sync"></i>
        </a>
    )
}