class item {
  constructor(width, height, image, name) {
    this.width = width;
    this.height = height;
    this.image = image;
    this.name = name;
  }
  get area() {
    return this.height * this.width;
  }
}

const root = document.documentElement;

const gridBlocks = document.getElementById("gridPage");
const itemSelector = document.getElementById("itemSelector");

let holding = false;
let row, column;
let pos;
const gridBlockLength = 2.3;
const itemListBlock = 20;
root.style.setProperty("--itemListBlocks", itemListBlock + "vw");
root.style.setProperty("--blockSize", gridBlockLength + "vw");

let items = [];
let dagger = new item(1, 2, "images/dagger.png", "dagger");
let shortsword = new item(1, 3, "images/shortsword.png", "shortsword");
let longsword = new item(1, 4, "images/longsword.png", "longsword");
items.push(dagger);
items.push(shortsword);
items.push(longsword);

const slector = document.getElementById("itemSelector");
items.forEach(displayItem);

function displayItem(item) {
  const pickableItem = document.createElement("div");
  pickableItem.className = "gridSpanTest";
  const itemIcon = document.createElement("img");
  itemIcon.src = item.image;
  itemIcon.className = "objectIcon";
  pickableItem.appendChild(itemIcon);
  if (item.width > item.height) {
    pickableItem.style.width = itemListBlock.toString().concat("vw");
    pickableItem.style.height = ((item.height / item.width) * itemListBlock).toString().concat("vw");
  } else {
    pickableItem.style.height = itemListBlock.toString().concat("vw");
    pickableItem.style.width = ((item.width / item.height) * itemListBlock).toString().concat("vw");
  }
  itemSelector.appendChild(pickableItem);
}

//  Adding grid background
for (let i = 0; i < 300; i++) {
  const gridSpace = document.createElement("div");
  gridSpace.className = "gridBlock";
  row = Math.floor(i / 20) + 1;
  column = (i % 20) + 1;
  pos = row.toString().concat(",", column.toString());
  gridSpace.style.gridRowStart = row;
  gridSpace.style.gridColumnStart = column;
  gridSpace.id = pos;
  gridSpace.addEventListener("click", placeItem.bind(this, row, column));
  gridBlocks.appendChild(gridSpace);
}

// creating test object
const divSpan = document.createElement("div");
const img = document.createElement("img");
img.src = "images/longsword.png";
img.className = "objectIcon";
divSpan.className = "gridSpanTest";
divSpan.appendChild(img);
divSpan.style.width = (gridBlockLength * longsword.width - 0.5).toString().concat("vw");
divSpan.style.height = (gridBlockLength * longsword.height - 0.5).toString().concat("vw");
gridBlocks.appendChild(divSpan);

// get mouse position inside the grid
gridBlocks.addEventListener("mousemove", (e) => {
  divSpan.style.setProperty("--mousex", e.clientX + "px");
  divSpan.style.setProperty("--mousey", e.clientY + "px");
});

divSpan.addEventListener("click", pickupItem);

function pickupItem() {
  if (!holding) {
    console.log("pickupItem");
    divSpan.style.position = "absolute";
    divSpan.style.pointerEvents = "none";
    divSpan.style.borderWidth = "0.5vw";
    divSpan.style.opacity = "0.6";
    holding = true;
  }
}

function placeItem(r, c) {
  if (holding) {
    console.log(r.toString().concat(",", c.toString()));
    row = r;
    column = c;
    console.log("placeItem");
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
