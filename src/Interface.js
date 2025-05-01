const root = document.documentElement;
        
const gridBlocks = document.getElementById("gridPage");
let holding = false;

// 2nd test object
const ob = document.createElement("div");
ob.className = "gridSpanTest";

let row, column;
let pos;
const gridBlockLength = 2.34;

//  Adding grid background
for (let i = 0; i < 300; i++){
    const gridSpace = document.createElement("div");
    gridSpace.className = "gridBlock";
    row = Math.floor(i/20)+1;
    column = (i%20)+1;
    pos = row.toString().concat(",", column.toString());
    gridSpace.style.gridRowStart = row;
    gridSpace.style.gridColumnStart = column;
    gridSpace.id = pos;
    gridSpace.addEventListener("click", place.bind(this, row, column));
    gridBlocks.appendChild(gridSpace);
}

// creating test object
const divSpan = document.createElement("div");
const img = document.createElement("img");
img.src = "images/swordVertical.jpg";
img.className = "objectIcon";
divSpan.className = "gridSpanTest";
divSpan.appendChild(img);
divSpan.style.width = ((gridBlockLength*2)-0.5).toString().concat("vw");
divSpan.style.height = ((gridBlockLength*5)-0.5).toString().concat("vw");
gridBlocks.appendChild(divSpan);

// get mouse position inside the grid
gridBlocks.addEventListener("mousemove", e => {
    divSpan.style.setProperty('--mousex', e.clientX + "px");
    divSpan.style.setProperty('--mousey', e.clientY + "px");
});

divSpan.addEventListener("click", handle);

function handle() {
    if (!holding) {
        console.log("pickup");
        divSpan.style.position = "absolute";
        divSpan.style.pointerEvents = "none";
        divSpan.style.borderWidth = "0.5vw";
        divSpan.style.opacity = "0.6";
        holding = true;
    }
}

function place(r, c) {
    if (holding) {
        console.log(r.toString().concat(",", c.toString()));
        row = r;
        column = c;
        console.log("place");
        divSpan.style.position = "static";
        divSpan.style.gridRowStart = parseInt(r);
        divSpan.style.gridColumnStart = parseInt(c);
        divSpan.style.backgroundColor = "white";
        divSpan.style.pointerEvents = "auto";
        divSpan.style.borderWidth = "0.25vw";
        divSpan.style.opacity = "1";
        holding = false;
    }
}