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
  constructor(position, id, width, height, image, name) {
    super(width, height, image, name);
    this.position = position;
    this.id = id;
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
  itemSize.innerHTML = "[" + item.width.toString() + ":" + item.height.toString() + "]";
  
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
  // need to save current items?
  loading = false;
}

function saveItems(profile) {
  localStorage.setItem(profile, JSON.stringify({items: inventory, idCount: idCounter}));
}

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

  item.addEventListener("mousedown", pickupItem.bind(this, itemID));
  inventory[itemID] = new inventoryItem(
    { r: itemType.position.r, c: itemType.position.c },
    itemID,
    itemType.width,
    itemType.height,
    itemType.image,
    itemType.name
  );
  gridBlocks.appendChild(item);
}

// copy item from menu
function copyItem(itemType) {
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
  idCounter++;

  gridBlocks.appendChild(item);
  inventory[itemID] = new inventoryItem(
    { r: -1, c: -1 },
    itemID,
    itemType.width,
    itemType.height,
    itemType.image,
    itemType.name
  );
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

function moveItem(r, c) {
  if (holding) {
    const item = document.getElementById(heldItemID);
    item.style.gridColumnStart = c.toString();
    item.style.gridRowStart = r.toString();
  }
}

// deleting items
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
