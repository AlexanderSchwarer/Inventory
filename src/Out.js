(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/Interface.js
  var require_Interface = __commonJS({
    "src/Interface.js"(exports) {
      var item = class {
        constructor(width, height, image, name) {
          this.width = width;
          this.height = height;
          this.image = image;
          this.name = name;
        }
        get area() {
          return this.height * this.width;
        }
      };
      var inventoryItem = class extends item {
        constructor(position, id, width, height, image, name, colour, rotated) {
          super(width, height, image, name);
          this.position = position;
          this.id = id;
          this.colour = colour;
          this.rotated = rotated || false;
        }
      };
      var root = document.documentElement;
      var gridBlocks = document.getElementById("gridPage");
      var itemSelector = document.getElementById("itemSelector");
      var contextMenu = document.getElementById("contextMenu");
      var colourMenu = document.getElementById("colour");
      var colourOptions = document.getElementById("colourOptions");
      var colourOptionText = document.getElementById("colourOptionText");
      var maxWeight = document.getElementById("maxWeight");
      var curWeight = document.getElementById("curWeight");
      var curWeightBar = document.getElementById("curWeightBar");
      var colourCodes = {
        red: "#FF7369",
        orange: "#ffa344",
        yellow: "#FFDC49",
        green: "#4DAB9A",
        blue: "#529CCA",
        purple: "#9A6DD7",
        pink: "#E255A1",
        grey: "#d9d9d9"
      };
      for (let colour in colourCodes) {
        const colourButton = document.createElement("div");
        colourButton.className = "colour";
        colourButton.style.backgroundColor = colourCodes[colour];
        colourButton.addEventListener(
          "click",
          setItemColour.bind(exports, colourCodes[colour])
        );
        colourOptions.appendChild(colourButton);
      }
      var holding = false;
      var row;
      var column;
      var pos;
      var idCounter = 0;
      var heldItemID;
      var contextItemID;
      var colourMenuOpen = false;
      var maxWeightValue = 10;
      var curWeightValue = 0;
      adjustWeight();
      var gridBlockLength = 2.3;
      var itemListBlock = 7.2;
      root.style.setProperty("--itemListBlocks", itemListBlock + "vw");
      root.style.setProperty("--blockSize", gridBlockLength + "vw");
      maxWeight.innerHTML = maxWeightValue.toString();
      curWeight.innerHTML = curWeightValue.toString();
      var items = [];
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
      var inventory = {};
      var slector = document.getElementById("itemSelector");
      items.forEach(displayItem);
      function displayItem(item2) {
        const pickableItem = document.createElement("div");
        const imagePadder = document.createElement("div");
        const itemIcon = document.createElement("img");
        const itemSize = document.createElement("div");
        const itemName = document.createElement("div");
        pickableItem.className = "item";
        imagePadder.className = "objectIconPadder";
        itemIcon.src = item2.image;
        itemIcon.className = "objectIcon";
        itemSize.className = "sizeTooltip";
        itemSize.innerHTML = "[" + item2.width.toString() + ":" + item2.height.toString() + "]";
        itemName.className = "tooltip";
        itemName.spellcheck = "false";
        itemName.innerHTML = item2.name;
        imagePadder.appendChild(itemIcon);
        pickableItem.appendChild(imagePadder);
        pickableItem.appendChild(itemSize);
        pickableItem.appendChild(itemName);
        if (item2.width > item2.height) {
          pickableItem.style.width = itemListBlock.toString().concat("vw");
          pickableItem.style.height = (item2.height / item2.width * itemListBlock).toString().concat("vw");
        } else {
          pickableItem.style.height = itemListBlock.toString().concat("vw");
          pickableItem.style.width = (item2.width / item2.height * itemListBlock).toString().concat("vw");
        }
        pickableItem.addEventListener("mousedown", copyItem.bind(this, item2));
        itemSelector.appendChild(pickableItem);
      }
      for (let i = 0; i < 300; i++) {
        const gridSpace = document.createElement("div");
        gridSpace.className = "gridBlock";
        row = Math.floor(i / 20) + 1;
        column = i % 20 + 1;
        pos = row.toString().concat(",", column.toString());
        gridSpace.style.gridRowStart = row;
        gridSpace.style.gridColumnStart = column;
        gridSpace.id = pos;
        gridSpace.addEventListener("click", placeItem.bind(exports, row, column));
        gridSpace.addEventListener("mouseenter", moveItem.bind(exports, row, column));
        gridBlocks.appendChild(gridSpace);
      }
      root.addEventListener("keydown", deleteItem);
      root.addEventListener("keydown", rotateItem);
      root.addEventListener("click", closeContextMenu);
      gridBlocks.addEventListener("contextmenu", (Event) => {
        Event.preventDefault();
        if (holding) {
          deleteItem(Event);
        }
      });
      colourMenu.addEventListener("click", showColourOptions);
      function copyItem(itemType) {
        if (!holding) {
          const item2 = document.createElement("div");
          const imagePadder = document.createElement("div");
          const icon = document.createElement("img");
          const itemName = document.createElement("div");
          imagePadder.className = "objectIconPadder";
          icon.className = "objectIcon";
          icon.src = itemType.image;
          item2.className = "item";
          let itemID = itemType.name.concat(idCounter.toString());
          item2.id = itemID;
          itemName.className = "tooltip";
          itemName.spellcheck = "false";
          itemName.id = itemID.concat("Name");
          itemName.contentEditable = "true";
          itemName.addEventListener("blur", () => {
            inventory[itemID].name = itemName.innerHTML;
          });
          itemName.innerHTML = itemType.name;
          imagePadder.appendChild(icon);
          item2.appendChild(imagePadder);
          item2.appendChild(itemName);
          item2.style.width = (gridBlockLength * itemType.width - 0.5).toString().concat("vw");
          item2.style.height = (gridBlockLength * itemType.height - 0.5).toString().concat("vw");
          item2.addEventListener("mousedown", pickupItem.bind(this, itemID));
          item2.addEventListener("contextmenu", openContextMenu.bind(this, itemID));
          idCounter++;
          gridBlocks.appendChild(item2);
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
          item2.classList.add("pickup");
          holding = true;
          curWeightValue += itemType.area;
          curWeight.innerHTML = curWeightValue.toString();
          adjustWeight();
        }
      }
      function pickupItem(id, event) {
        if (!holding && event.button == 0 && event.target.className != "tooltip") {
          console.log("pickupItem");
          console.log(event.target.className);
          heldItemID = id;
          const item2 = document.getElementById(id);
          item2.classList.remove("place");
          item2.classList.add("pickup");
          holding = true;
        }
      }
      function rotateItem(event) {
        if (holding && (event.key == "r" || event.key == "R")) {
          const item2 = document.getElementById(heldItemID);
          let width = item2.style.width;
          let height = item2.style.height;
          item2.style.width = height;
          item2.style.height = width;
          const image = item2.querySelector(".objectIcon");
          if (image.classList.contains("rotate")) {
            image.classList.remove("rotate");
            image.style.width = "100%";
            image.style.height = "100%";
          } else {
            width = width.slice(0, width.length - 2);
            height = height.slice(0, height.length - 2);
            image.style.width = (width / height * 100).toString().concat("%");
            image.style.height = (height / width * 100).toString().concat("%");
            image.classList.add("rotate");
            inventory[heldItemID].rotated = true;
          }
        }
      }
      function moveItem(r, c) {
        if (holding) {
          const item2 = document.getElementById(heldItemID);
          item2.style.gridColumnStart = c.toString();
          item2.style.gridRowStart = r.toString();
        }
      }
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
      function showColourOptions() {
        if (!colourMenuOpen) {
          colourOptions.classList.remove("close");
          colourOptions.classList.add("open");
          colourMenuOpen = true;
          colourOptionText.innerHTML = "COLOUR &#11207";
        } else {
          colourOptions.classList.remove("open");
          colourOptions.classList.add("close");
          colourMenuOpen = false;
          colourOptionText.innerHTML = "COLOUR &#11208";
        }
      }
      function setItemColour(colour) {
        const item2 = document.getElementById(contextItemID);
        item2.style.backgroundColor = colour;
        inventory[contextItemID].colour = colour;
      }
      function closeContextMenu(event) {
        if (event.target.parentElement.id != "contextMenu") {
          contextMenu.classList.remove("open");
          contextMenu.classList.add("close");
          colourOptionText.innerHTML = "COLOUR &#11208";
        }
      }
      function deleteItem(event) {
        if (holding && (event.key == "x" || event.key == "Escape" || event.button == 2)) {
          console.log("delete");
          curWeightValue -= inventory[heldItemID].area;
          curWeight.innerHTML = curWeightValue.toString();
          adjustWeight();
          const item2 = document.getElementById(heldItemID);
          item2.removeEventListener("mousedown", pickupItem);
          item2.remove();
          delete inventory[heldItemID];
          holding = false;
          heldItemID = "";
        }
      }
      function placeItem(r, c) {
        if (holding) {
          console.log(r.toString().concat(",", c.toString()));
          const item2 = document.getElementById(heldItemID);
          row = r;
          column = c;
          console.log("placeItem");
          item2.style.gridRowStart = parseInt(r);
          item2.style.gridColumnStart = parseInt(c);
          item2.classList.remove("pickup");
          item2.classList.add("place");
          inventory[heldItemID].position.r = r;
          inventory[heldItemID].position.c = c;
          holding = false;
          heldItemID = "";
        }
      }
      function adjustWeight() {
        if (curWeightValue > maxWeightValue) {
          curWeight.classList.add("overweight");
          curWeightBar.style.width = "100%";
          curWeightBar.style.backgroundColor = "rgb(126, 20, 20)";
        } else {
          curWeightBar.style.width = (curWeightValue / maxWeightValue * 100).toString().concat("%");
          let shift = curWeightValue / maxWeightValue * 40 + 30;
          curWeightBar.style.backgroundColor = "rgb(" + shift.toString() + "," + (100 - shift).toString() + ",30)";
          curWeight.classList.remove("overweight");
          if (curWeightValue / maxWeightValue * 100 < 10) {
            curWeight.classList.add("underweight");
          } else {
            curWeight.classList.remove("underweight");
          }
        }
      }
    }
  });
  require_Interface();
})();
