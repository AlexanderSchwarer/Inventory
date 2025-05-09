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

// getting constant elements
const root = document.documentElement;
const gridBlocks = document.getElementById("gridPage");
const itemSelector = document.getElementById("itemSelector");

// global variables
let holding = false;
let row, column;
let pos;
let idCounter = 0;
let heldItemID;
const gridBlockLength = 2.3;
const itemListBlock = 12;
// constant css variables are set to the above constant values
root.style.setProperty("--itemListBlocks", itemListBlock + "vw");
root.style.setProperty("--blockSize", gridBlockLength + "vw");

// Populating Item menu
let items = [];
let dagger = new item(1, 2, "images/dagger.svg", "dagger");
let shortsword = new item(1, 3, "images/ArmingSword.svg", "ArmingSword");
let scimitar = new item(1, 3, "images/scimitar.svg", "scimitar");
let longsword = new item(1, 4, "images/longsword.svg", "longsword");
items.push(dagger);
items.push(shortsword);
items.push(scimitar);
items.push(longsword);

const slector = document.getElementById("itemSelector");
items.forEach(displayItem);

function displayItem(item) {
  const pickableItem = document.createElement("div");
  const imagePadder = document.createElement("div");
  const itemIcon = document.createElement("img");

  pickableItem.className = "item";
  imagePadder.className = "objectIconPadder";
  itemIcon.src = item.image;
  itemIcon.className = "objectIcon";

  imagePadder.appendChild(itemIcon);
  pickableItem.appendChild(imagePadder);

  if (item.width > item.height) {
    pickableItem.style.width = itemListBlock.toString().concat("vw");
    pickableItem.style.height = ((item.height / item.width) * itemListBlock)
      .toString()
      .concat("vw");
  } else {
    pickableItem.style.height = itemListBlock.toString().concat("vw");
    pickableItem.style.width = ((item.width / item.height) * itemListBlock)
      .toString()
      .concat("vw");
  }

  pickableItem.addEventListener("mousedown", copyItem.bind(this, item));

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
  gridSpace.addEventListener("mouseenter", moveItem.bind(this, row, column));
  gridBlocks.appendChild(gridSpace);
}

function moveItem(r, c){
  if (holding) {
    const item = document.getElementById(heldItemID);
    item.style.gridColumnStart = c.toString();
    item.style.gridRowStart = r.toString();
  }
}

// copy item from menu
function copyItem(itemType) {
  const item = document.createElement("div");
  const imagePadder = document.createElement("div");
  const icon = document.createElement("img");

  imagePadder.className = "objectIconPadder";
  icon.className = "objectIcon";
  icon.src = itemType.image;
  item.className = "item";
  let itemID = itemType.name.concat(idCounter.toString());
  item.id = itemID;

  imagePadder.appendChild(icon);
  item.appendChild(imagePadder);

  item.style.width = (gridBlockLength * itemType.width - 0.5)
    .toString()
    .concat("vw");
  item.style.height = (gridBlockLength * itemType.height - 0.5)
    .toString()
    .concat("vw");

  item.addEventListener("mousedown", pickupItem.bind(this, itemID));
  idCounter++;

  gridBlocks.appendChild(item);
  pickupItem(itemID);
}

function pickupItem(id) {
  if (!holding) {
    console.log("pickupItem");
    heldItemID = id;
    const item = document.getElementById(id);
    item.style.pointerEvents = "none";
    item.style.borderWidth = "0.5vw";
    item.style.opacity = "0.6";
    holding = true;
  }
}

function placeItem(r, c) {
  if (holding) {
    console.log(r.toString().concat(",", c.toString()));
    const item = document.getElementById(heldItemID);
    row = r;
    column = c;
    console.log("placeItem");
    // item.style.position = "static";
    item.style.gridRowStart = parseInt(r);
    item.style.gridColumnStart = parseInt(c);
    item.style.backgroundColor = "white";
    item.style.pointerEvents = "auto";
    item.style.borderWidth = "0.25vw";
    item.style.opacity = "1";
    holding = false;
    heldItemID = "";
  }
}
