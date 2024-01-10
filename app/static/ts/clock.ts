function startTime() {
  const clock = document.getElementById("clock")!;
  if (clock != null) clock.innerHTML = new Date().toLocaleTimeString('it-IT');
  let t = setTimeout(startTime, 1000);
}

function appendZero(time: number) {
  return (time < 10) ? "0" + time.toString() : time.toString();
}

startTime();