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

class inventoryItem extends item {
  constructor(position, id, width, height, image, name, colour) {
    super(width, height, image, name);
    this.position = position;
    this.id = id;
    this.colour = colour;
  }
}

// getting constant elements
const root = document.documentElement;
const gridBlocks = document.getElementById("gridPage");
const itemSelector = document.getElementById("itemSelector");
const contextMenu = document.getElementById("contextMenu");
const colourMenu = document.getElementById("colour");
const colourOptions = document.getElementById("colourOptions");
// colours
const colourCodes = {
  red: "#ac2222",
  orange: "#ac5522",
  yellow: "#ac8c22",
  green: "#22ac4b",
  blue: "#2242ac",
  purple: "#9122ac",
  grey: "#ad9d9d"
};
const red = document.getElementById("red");
red.style.backgroundColor = colourCodes.red;
red.addEventListener("click", setItemColour.bind(this, colourCodes.red));
const orange = document.getElementById("orange");
orange.style.backgroundColor = colourCodes.orange;
orange.addEventListener("click", setItemColour.bind(this, colourCodes.orange));
const yellow = document.getElementById("yellow");
yellow.style.backgroundColor = colourCodes.yellow;
yellow.addEventListener("click", setItemColour.bind(this, colourCodes.yellow));
const green = document.getElementById("green");
green.style.backgroundColor = colourCodes.green;
green.addEventListener("click", setItemColour.bind(this, colourCodes.green));
const blue = document.getElementById("blue");
blue.style.backgroundColor = colourCodes.blue;
blue.addEventListener("click", setItemColour.bind(this, colourCodes.blue));
const purple = document.getElementById("purple");
purple.style.backgroundColor = colourCodes.purple;
purple.addEventListener("click", setItemColour.bind(this, colourCodes.purple));
const grey = document.getElementById("grey");
grey.style.backgroundColor = colourCodes.grey;
grey.addEventListener("click", setItemColour.bind(this, colourCodes.grey));

// global variables
let holding = false;
let row, column;
let pos;
let idCounter = 0;
let heldItemID;
let contextItemID;
let loading = false;
const gridBlockLength = 2.3;
const itemListBlock = 12;
// constant css variables are set to the above constant values
root.style.setProperty("--itemListBlocks", itemListBlock + "vw");
root.style.setProperty("--blockSize", gridBlockLength + "vw");

// Populating Item menu -- to be moved to a separate file for scalability
let items = [];
let dagger = new item(1, 2, "images/dagger.svg", "dagger");
let club = new item(1, 3, "images/Club.svg", "club");
let greatclub = new item(1, 5, "images/Greatclub.svg", "greatclub");
let handaxe = new item(1, 2, "images/Handaxe.svg", "handaxe");
let shortsword = new item(1, 3, "images/ArmingSword.svg", "ArmingSword");
let scimitar = new item(1, 3, "images/scimitar.svg", "scimitar");
let longsword = new item(1, 4, "images/longsword.svg", "longsword");
let whip = new item(2, 2, "images/Whip.svg", "whip");

items.push(dagger);
items.push(club);
items.push(greatclub);
items.push(shortsword);
items.push(scimitar);
items.push(longsword);
items.push(whip);
items.push(handaxe);

let inventory = {};

const slector = document.getElementById("itemSelector");
items.forEach(displayItem);

function displayItem(item) {
  const pickableItem = document.createElement("div");
  const imagePadder = document.createElement("div");
  const itemIcon = document.createElement("img");
  const itemSize = document.createElement("div");

  pickableItem.className = "item";
  imagePadder.className = "objectIconPadder";
  itemIcon.src = item.image;
  itemIcon.className = "objectIcon";
  itemSize.className = "tooltip";
  itemSize.innerHTML =
    "[" + item.width.toString() + ":" + item.height.toString() + "]";

  imagePadder.appendChild(itemIcon);
  pickableItem.appendChild(imagePadder);
  pickableItem.appendChild(itemSize);

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

root.addEventListener("keydown", deleteItem);
root.addEventListener("click", closeContextMenu);
gridBlocks.addEventListener("contextmenu", (Event) => {Event.preventDefault()});
colourMenu.addEventListener("click", showColourOptions);

// LOAD PROFILE FROM FILE
function loadItems(profile) {
  loading = true;
  for (let currentItem in inventory) {
    const item = document.getElementById(currentItem);
    item.removeEventListener("mousedown", pickupItem);
    item.remove();
  }
  inventory = JSON.parse(localStorage.getItem(profile)).items;
  idCounter = JSON.parse(localStorage.getItem(profile)).idCount;
  for (let incomingItem in inventory) {
    copyItemFromFile(inventory[incomingItem]);
  }
  loading = false;
}

//  SAVE ITEMS TO FILE
function saveItems(profile) {
  localStorage.setItem(
    profile,
    JSON.stringify({ items: inventory, idCount: idCounter })
  );
}

// LOAD ITEM FROM FILE
function copyItemFromFile(itemType) {
  const item = document.createElement("div");
  const imagePadder = document.createElement("div");
  const icon = document.createElement("img");
  const itemName = document.createElement("div");

  imagePadder.className = "objectIconPadder";
  icon.className = "objectIcon";
  icon.src = itemType.image;
  item.className = "item";
  let itemID = itemType.id;
  item.id = itemID;
  itemName.className = "tooltip";
  itemName.innerHTML = itemType.name;

  imagePadder.appendChild(icon);
  item.appendChild(imagePadder);
  item.appendChild(itemName);

  item.style.width = (gridBlockLength * itemType.width - 0.5)
    .toString()
    .concat("vw");
  item.style.height = (gridBlockLength * itemType.height - 0.5)
    .toString()
    .concat("vw");

  item.style.gridRowStart = itemType.position.r;
  item.style.gridColumnStart = itemType.position.c;

  item.style.backgroundColor = itemType.colour;

  item.addEventListener("mousedown", pickupItem.bind(this, itemID));
  item.addEventListener("contextmenu", openContextMenu.bind(this, itemID));
  inventory[itemID] = new inventoryItem(
    { r: itemType.position.r, c: itemType.position.c },
    itemID,
    itemType.width,
    itemType.height,
    itemType.image,
    itemType.name,
    itemType.colour
  );
  gridBlocks.appendChild(item);
}

// COPY ITEM FROM MENU
function copyItem(itemType) {
  if (!holding) {
    const item = document.createElement("div");
    const imagePadder = document.createElement("div");
    const icon = document.createElement("img");
    const itemName = document.createElement("div");

    imagePadder.className = "objectIconPadder";
    icon.className = "objectIcon";
    icon.src = itemType.image;
    item.className = "item";
    let itemID = itemType.name.concat(idCounter.toString());
    item.id = itemID;
    itemName.className = "tooltip";
    itemName.innerHTML = itemType.name;

    imagePadder.appendChild(icon);
    item.appendChild(imagePadder);
    item.appendChild(itemName);

    item.style.width = (gridBlockLength * itemType.width - 0.5)
      .toString()
      .concat("vw");
    item.style.height = (gridBlockLength * itemType.height - 0.5)
      .toString()
      .concat("vw");

    item.addEventListener("mousedown", pickupItem.bind(this, itemID));
    item.addEventListener("contextmenu", openContextMenu.bind(this, itemID));
    idCounter++;

    gridBlocks.appendChild(item);
    inventory[itemID] = new inventoryItem(
      { r: -1, c: -1 },
      itemID,
      itemType.width,
      itemType.height,
      itemType.image,
      itemType.name,
      colourCodes.grey
    );
    console.log("pickupItem");
    heldItemID = itemID;
    item.style.pointerEvents = "none";
    item.style.borderWidth = "0.5vw";
    item.style.opacity = "0.6";
    holding = true;
  }
}

//  PICKUP ITEM
function pickupItem(id, event) {
  if (!holding && event.button == 0) {
    console.log("pickupItem");
    heldItemID = id;
    const item = document.getElementById(id);
    item.style.pointerEvents = "none";
    item.style.borderWidth = "0.5vw";
    item.style.opacity = "0.6";
    holding = true;
  }
}

//  MOVE ITEM
function moveItem(r, c) {
  if (holding) {
    const item = document.getElementById(heldItemID);
    item.style.gridColumnStart = c.toString();
    item.style.gridRowStart = r.toString();
  }
}

//  OPEN CONTEXT MENU
function openContextMenu(id, event) {
  event.preventDefault();
  let x = event.clientX;
  let y = event.clientY;
  root.style.setProperty("--mousex", x + "px");
  root.style.setProperty("--mousey", y + "px");
  contextMenu.style.opacity = "1";
  contextMenu.style.pointerEvents = "auto";
  contextItemID = id;
}

//  SHOW COLOUR OPTIONS
function showColourOptions() {
  colourOptions.style.visibility = "visible";
  colourOptions.style.opacity = 1;
}

//  SET ITEM COLOUR
function setItemColour(colour) {
  const item = document.getElementById(contextItemID);
  item.style.backgroundColor = colour;
  inventory[contextItemID].colour = colour;
}

//  CLOSE CONTEXT MENU
function closeContextMenu(event) {
  if (event.target.parentElement.id != "contextMenu") {
    contextMenu.style.opacity = 0;
    contextMenu.style.pointerEvents = "none";
    colourOptions.style.visibility = "hidden";
    colourOptions.style.opacity = 0;
  }
}

// DELETE ITEM
function deleteItem(event) {
  if (holding && (event.key == "x" || event.key == "Escape")) {
    console.log("delete");
    const item = document.getElementById(heldItemID);
    item.removeEventListener("mousedown", pickupItem);
    item.remove();
    delete inventory[heldItemID];
    holding = false;
    heldItemID = "";
  }
}

//  PLACE ITEM
function placeItem(r, c) {
  if (holding) {
    console.log(r.toString().concat(",", c.toString()));
    const item = document.getElementById(heldItemID);
    row = r;
    column = c;
    console.log("placeItem");
    item.style.gridRowStart = parseInt(r);
    item.style.gridColumnStart = parseInt(c);
    item.style.pointerEvents = "auto";
    item.style.borderWidth = "0.25vw";
    item.style.opacity = "1";
    inventory[heldItemID].position.r = r;
    inventory[heldItemID].position.c = c;
    holding = false;
    heldItemID = "";
  }
}
