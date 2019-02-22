alert('ETA GUSTAVÃO É MITO DIMAIS');

function pintar (hue = 100 , lgt = 50) {
    document.body.style.background = `hsl(${hue}deg,100%,${lgt}%)`;
}

function  clickHandler (event) {
    let x = event.x
    let y = event.y 

    let screenWidth = window.innerWidth
    let screenHeight = window.innerHeight

    let color = screenWidth/360
    let ligth = screenHeight/100

    pintar(x/color, ((y/ligth) - 100) * -1)
    console.log((y/ligth) - 100 )
}

window.addEventListener("mousemove", clickHandler);
 