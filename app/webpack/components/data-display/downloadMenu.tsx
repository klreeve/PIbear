import axios from 'axios';
import React, { useState } from 'react';

export const DownloadMenu = () => {
    const DEFAULT_MODE = "all";
    const DEFAULT_LOCATION = "client";

    const [mode, setMode] = useState<string>(DEFAULT_MODE);
    const [location, setLocation] = useState<string>(DEFAULT_LOCATION);

    // Called when download button is clicked
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = `download/${mode}`;

        if (location == "client") {
            const link = document.createElement('a');
            link.href = url;
            link.download = "true";
            document.body.appendChild(link);
            link.click();
            link.remove();
        } else {
            axios.post(url);
        }
    };

    return (
        <div className="download-form">
            <form onSubmit={e => handleSubmit(e)}>
            <div className="select">
                    <select
                        name="location"
                        value={location}
                        onChange={(
                            e: React.ChangeEvent<HTMLSelectElement>,
                        ): void => setLocation(e.target.value)}

                    >
                        <option value="client">Client</option>
                        <option value="server">Pi</option>
                    </select>
              </div>
              <div className="select">
                    <select
                        name="mode"
                        value={mode}
                        onChange={(
                            e: React.ChangeEvent<HTMLSelectElement>,
                        ): void => setMode(e.target.value)}

                    >
                        <option value="all">All</option>
                        <option value="recent">Recent</option>
                    </select>
              </div>
              <input className="submit-button" type="submit" value="DOWNLOAD"/>
            </form>
        </div>
    );
}