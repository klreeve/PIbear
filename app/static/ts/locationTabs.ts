function getCookie(cname: string) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function createCookie(name: string, value: string, minutes: number) {
    if (minutes) {
        var date = new Date();
        date.setTime(date.getTime()+(minutes*60*1000));
        var expires = "; expires="+date.toUTCString();
    } else {
        var expires = "";
    }
    document.cookie = name+"="+value+expires+"; path=/";
}

function setTabsNone() {
    const tabcontent = Array.from(document.getElementsByClassName("tabcontent"));
    for (let tab of tabcontent) {
        (tab as HTMLElement).style.display = "none";
    }
}

function openTab(evt: MouseEvent, tabName: string) {
    setTabsNone();
    document.getElementById(tabName)!.style.display = "block";
    createCookie("locationTab", tabName, 5);
}

const locationTabCookie = getCookie("locationTab");
if (locationTabCookie !== "") {
    setTabsNone();
    document.getElementById(locationTabCookie)!.style.display = "block";
}
