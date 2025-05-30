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
  constructor(position, id, width, height, image, name, colour, rotated) {
    super(width, height, image, name);
    this.position = position;
    this.id = id;
    this.colour = colour;
    this.rotated = rotated || false;
  }
}

// getting constant elements
const root = document.documentElement;
const gridBlocks = document.getElementById("gridPage");
const itemSelector = document.getElementById("itemSelector");
const contextMenu = document.getElementById("contextMenu");
const colourMenu = document.getElementById("colour");
const colourOptions = document.getElementById("colourOptions");
const colourOptionText = document.getElementById("colourOptionText");
const maxWeight = document.getElementById("maxWeight");
const curWeight = document.getElementById("curWeight");
const curWeightBar = document.getElementById("curWeightBar");

// colours
const colourCodes = {
  red: "#FF7369",
  orange: "#ffa344",
  yellow: "#FFDC49",
  green: "#4DAB9A",
  blue: "#529CCA",
  purple: "#9A6DD7",
  pink: "#E255A1",
  grey: "#d9d9d9",
};
for (let colour in colourCodes) {
  const colourButton = document.createElement("div");
  colourButton.className = "colour";
  colourButton.style.backgroundColor = colourCodes[colour];
  colourButton.addEventListener(
    "click",
    setItemColour.bind(this, colourCodes[colour])
  );
  colourOptions.appendChild(colourButton);
}

// global variables
let holding = false;
let row, column;
let pos;
let idCounter = 0;
let heldItemID;
let contextItemID;
let colourMenuOpen = false;
let loading = false;
let maxWeightValue = 10;
let curWeightValue = 0;
adjustWeight();
const gridBlockLength = 2.3; /*4.6*/
const itemListBlock = 7.2;
// constant css variables are set to the above constant values
root.style.setProperty("--itemListBlocks", itemListBlock + "vw");
root.style.setProperty("--blockSize", gridBlockLength + "vw");

maxWeight.innerHTML = maxWeightValue.toString();
curWeight.innerHTML = curWeightValue.toString();

// Populating Item menu -- to be moved to a separate file for scalability
let items = [];

items.push(new item(1, 2, "images/dagger.svg", "dagger"));
items.push(new item(1, 3, "images/Club.svg", "club"));
items.push(new item(2, 5, "images/Greatclub.svg", "greatclub"));
items.push(new item(1, 5, "images/Javelin.svg", "javelin"));
items.push(new item(1, 2, "images/Handaxe.svg", "handaxe"));
items.push(new item(1, 2, "images/lightHammer.svg", "lightHammer"));
items.push(new item(1, 2, "images/lightHammer.svg", "mace"));
items.push(new item(1, 2, "images/lightHammer.svg", "quarterstaff"));
items.push(new item(1, 2, "images/lightHammer.svg", "sickle"));
items.push(new item(1, 2, "images/lightHammer.svg", "spear"));
items.push(new item(1, 2, "images/lightHammer.svg", "lightCrossbow"));
items.push(new item(1, 2, "images/lightHammer.svg", "dart"));
items.push(new item(1, 2, "images/lightHammer.svg", "shortbow"));
items.push(new item(1, 2, "images/lightHammer.svg", "sling"));
items.push(new item(1, 3, "images/ArmingSword.svg", "ArmingSword"));
items.push(new item(1, 3, "images/scimitar.svg", "scimitar"));
items.push(new item(1, 4, "images/longsword.svg", "longsword"));
items.push(new item(2, 2, "images/Whip.svg", "whip"));

let inventory = {};

const slector = document.getElementById("itemSelector");
items.forEach(displayItem);
// Displaying items in the item selector
function displayItem(item) {
  const pickableItem = document.createElement("div");
  const imagePadder = document.createElement("div");
  const itemIcon = document.createElement("img");
  const itemSize = document.createElement("div");
  const itemName = document.createElement("div");

  pickableItem.className = "item";
  imagePadder.className = "objectIconPadder";
  itemIcon.src = item.image;
  itemIcon.className = "objectIcon";
  itemSize.className = "sizeTooltip";
  itemSize.innerHTML =
    "[" + item.width.toString() + ":" + item.height.toString() + "]";

  itemName.className = "tooltip";
  itemName.spellcheck = "false";
  itemName.innerHTML = item.name;

  imagePadder.appendChild(itemIcon);
  pickableItem.appendChild(imagePadder);
  pickableItem.appendChild(itemSize);
  pickableItem.appendChild(itemName);

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

// root event listeners
root.addEventListener("keydown", deleteItem);
root.addEventListener("keydown", rotateItem);
root.addEventListener("click", closeContextMenu);
// right-click deletes held items
gridBlocks.addEventListener("contextmenu", (Event) => {
  Event.preventDefault();
  if (holding) {
    deleteItem(Event);
  }
});
colourMenu.addEventListener("click", showColourOptions);

// LOAD PROFILE FROM FILE
function loadItems(profile) {
  loading = true;
  // clear the grid
  for (let currentItem in inventory) {
    const item = document.getElementById(currentItem);
    item.removeEventListener("mousedown", pickupItem);
    item.remove();
  }
  // populate
  inventory = JSON.parse(localStorage.getItem(profile)).items;
  idCounter = JSON.parse(localStorage.getItem(profile)).idCount;
  maxWeightValue = JSON.parse(localStorage.getItem(profile)).maxWeight;
  curWeightValue = JSON.parse(localStorage.getItem(profile)).curWeight;
  maxWeight.innerHTML = maxWeightValue.toString();
  curWeight.innerHTML = curWeightValue.toString();
  adjustWeight();
  for (let incomingItem in inventory) {
    copyItemFromFile(inventory[incomingItem]);
  }
  loading = false;
}

//  SAVE ITEMS TO FILE
function saveItems(profile) {
  localStorage.setItem(
    profile,
    JSON.stringify({
      items: inventory,
      idCount: idCounter,
      maxWeight: maxWeightValue,
      curWeight: curWeightValue,
    })
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
  itemName.spellcheck = "false";
  itemName.id = itemID.concat("Name");
  itemName.contentEditable = "true";
  itemName.addEventListener("blur", () => {
    inventory[itemID].name = itemName.innerHTML;
  });
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
    itemType.colour,
    itemType.rotated
  );
  gridBlocks.appendChild(item);

  if (itemType.rotated) {
    let width = item.style.width;
    let height = item.style.height;
    item.style.width = height;
    item.style.height = width;

    width = width.slice(0, width.length - 2);
    height = height.slice(0, height.length - 2);
    icon.style.width = ((width / height) * 100).toString().concat("%");
    icon.style.height = ((height / width) * 100).toString().concat("%");
    icon.classList.add("rotate");
  }
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
    itemName.spellcheck = "false";
    itemName.id = itemID.concat("Name");
    itemName.contentEditable = "true";
    itemName.addEventListener("blur", () => {
      inventory[itemID].name = itemName.innerHTML;
    });
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
    item.classList.add("pickup");
    holding = true;

    // update current weight
    curWeightValue += itemType.area;
    curWeight.innerHTML = curWeightValue.toString();
    adjustWeight();
  }
}

//  PICKUP ITEM
function pickupItem(id, event) {
  if (!holding && event.button == 0 && event.target.className != "tooltip") {
    console.log("pickupItem");
    console.log(event.target.className);
    heldItemID = id;
    const item = document.getElementById(id);
    item.classList.remove("place");
    item.classList.add("pickup");
    holding = true;
  }
}

function rotateItem(event) {
  if (holding && (event.key == "r" || event.key == "R")) {
    const item = document.getElementById(heldItemID);
    let width = item.style.width;
    let height = item.style.height;
    item.style.width = height;
    item.style.height = width;
    // we don't change height and width in inventory, when items are loaded they start unrotated.
    // rotate the image
    const image = item.querySelector(".objectIcon");

    if (image.classList.contains("rotate")) {
      image.classList.remove("rotate");
      image.style.width = "100%";
      image.style.height = "100%";
    } else {
      width = width.slice(0, width.length - 2);
      height = height.slice(0, height.length - 2);
      image.style.width = ((width / height) * 100).toString().concat("%");
      image.style.height = ((height / width) * 100).toString().concat("%");
      image.classList.add("rotate");
      inventory[heldItemID].rotated = true;
    }
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
  contextMenu.classList.remove("close");
  contextMenu.classList.add("open");
  contextItemID = id;
}

//  SHOW COLOUR OPTIONS
function showColourOptions() {
  if (!colourMenuOpen) {
    colourOptions.classList.remove("close");
    colourOptions.classList.add("open");
    // colourOptions.style.opacity = "1";
    colourMenuOpen = true;
    colourOptionText.innerHTML = "COLOUR &#11207";
  } else {
    colourOptions.classList.remove("open");
    colourOptions.classList.add("close");
    colourMenuOpen = false;
    colourOptionText.innerHTML = "COLOUR &#11208";
  }
}

//  SET ITEM COLOUR
function setItemColour(colour) {
  const item = document.getElementById(contextItemID);
  item.style.backgroundColor = colour;
  inventory[contextItemID].colour = colour;
}

//RENAME ITEM
function renameItem() {
  console.log("renameItem");
  let id = contextItemID.concat("Name");
  const itemName = document.getElementById(id);
  itemName.focus();
  contextMenu.classList.remove("open");
  contextMenu.classList.add("close");
  colourOptionText.innerHTML = "COLOUR &#11208";
}

//  CLOSE CONTEXT MENU
function closeContextMenu(event) {
  if (event.target.parentElement.id != "contextMenu") {
    contextMenu.classList.remove("open");
    contextMenu.classList.add("close");
    colourOptionText.innerHTML = "COLOUR &#11208";
  }
}

// DELETE ITEM
function deleteItem(event) {
  if (
    holding &&
    (event.key == "x" || event.key == "Escape" || event.button == 2)
  ) {
    console.log("delete");
    // update current weight
    curWeightValue -= inventory[heldItemID].area;
    curWeight.innerHTML = curWeightValue.toString();
    adjustWeight();
    // delete element
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
    item.classList.remove("pickup");
    item.classList.add("place");
    inventory[heldItemID].position.r = r;
    inventory[heldItemID].position.c = c;
    holding = false;
    heldItemID = "";
  }
}

// ADJUST WEIGHT
function adjustWeight() {
  if (curWeightValue > maxWeightValue) {
    curWeight.classList.add("overweight");
    curWeightBar.style.width = "100%";
    curWeightBar.style.backgroundColor = "rgb(126, 20, 20)";
  } else {
    curWeightBar.style.width = ((curWeightValue / maxWeightValue) * 100)
      .toString()
      .concat("%");
    let shift = (curWeightValue / maxWeightValue) * 40 + 30;
    curWeightBar.style.backgroundColor =
      "rgb(" + shift.toString() + "," + (100 - shift).toString() + ",30)";
    curWeight.classList.remove("overweight");
    if ((curWeightValue / maxWeightValue) * 100 < 10) {
      curWeight.classList.add("underweight");
    } else {
      curWeight.classList.remove("underweight");
    }
  }
}
