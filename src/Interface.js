const root = document.documentElement;
        
const gridBlocks = document.getElementById("gridPage");

// 2nd test object
const ob = document.createElement("div");
ob.className = "gridSpanTest";

let row, column;

//  Adding grid background
for (let i = 0; i < 300; i++){
    const gridSpace = document.createElement("div");
    gridSpace.className = "gridBlock";
    row = Math.floor(i/20)+1;
    column = i%20;
    gridSpace.style.gridRowStart = row;
    gridSpace.style.gridColumnStart = column;
    gridBlocks.appendChild(gridSpace);
}

// creating test object
const divSpan = document.createElement("div");
const img = document.createElement("img");
img.src = "images/swordHorizontal.jpg";
img.className = "objectIcon";
divSpan.className = "gridSpanTest";
divSpan.appendChild(img);
gridBlocks.appendChild(divSpan);

let holding = false;

// get mouse position inside the grid
gridBlocks.addEventListener("mousemove", e => {
    divSpan.style.setProperty('--mousex', e.clientX + "px");
    divSpan.style.setProperty('--mousey', e.clientY + "px");
});

divSpan.addEventListener("click", pickup);

function pickup() {
    if (holding == false) {
        divSpan.style.position = "absolute";
        divSpan.style.backgroundColor = "blue";
        // divSpan.style.left = "var(--mousex)";
        // divSpan.style.top = "var(--mousey)";
    }
    holding = true;
}