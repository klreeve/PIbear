function startTime(){var clock=document.getElementById("clock");if(clock!=null)
clock.innerHTML=new Date().toLocaleTimeString('it-IT');var t=setTimeout(startTime,1000);}
function appendZero(time){return(time<10)?"0"+time.toString():time.toString();}
startTime();function getCookie(cname){var name=cname+"=";var decodedCookie=decodeURIComponent(document.cookie);var ca=decodedCookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' '){c=c.substring(1);}
if(c.indexOf(name)==0){return c.substring(name.length,c.length);}}
return"";}
function createCookie(name,value,minutes){if(minutes){var date=new Date();date.setTime(date.getTime()+(minutes*60*1000));var expires="; expires="+date.toUTCString();}
else{var expires="";}
document.cookie=name+"="+value+expires+"; path=/";}
function setTabsNone(){var tabcontent=Array.from(document.getElementsByClassName("tabcontent"));for(var _i=0,tabcontent_1=tabcontent;_i<tabcontent_1.length;_i++){var tab=tabcontent_1[_i];tab.style.display="none";}}
function openTab(evt,tabName){setTabsNone();document.getElementById(tabName).style.display="block";createCookie("locationTab",tabName,5);}
var locationTabCookie=getCookie("locationTab");if(locationTabCookie!==""){setTabsNone();document.getElementById(locationTabCookie).style.display="block";}