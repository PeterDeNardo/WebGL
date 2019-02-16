function backgroundColor (hue, lgt){
    document.body.style.background = `hsl(${hue}deg, 100%, ${lgt}%)`;
}

function clickHandler (event) {
    let x = event.x;
    let y = event.y;

    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    let color = screenWidth / 360;
    let ligth = screenHeight / 100;

    backgroundColor(x / color, (((y / ligth) - 100) * -1));
}

window.addEventListener('mousemove', clickHandler);