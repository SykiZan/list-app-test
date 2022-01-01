"use strict";

const input = document.querySelector(".input");

const field = document.querySelector(".list-field");
const list = document.querySelector(".list");

const btnAdd = document.querySelector(".btn-add-pair");
const btnSortName = document.querySelector(".btn-action-sort-name");
const btnSortValue = document.querySelector(".btn-action-sort-value");
const btnDelete = document.querySelector(".btn-action-delete");
const btnXml = document.querySelector(".btn-action-xml");

const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const xml = document.querySelector(".xml");

let listArr = [];
const arrToDeleteId = [];
const classesBeforeSort = [];
let itemsCount = 0;
let clickedElementPos = null;
let clickedElementPosArr = [];
let items = null;

// this button proceses value from input field
btnAdd.addEventListener("click", () => {
  const isValid = validate(input.value);
  if (!isValid) return;
  itemsCount++;
  let li = document.createElement("li");
  li.setAttribute("id", itemsCount);
  li.className = `item item-${itemsCount}`;
  li.textContent = input.value;
  list.append(li);

  parseInput(input.value); // will create array and push an object (name/value)

  input.value = ""; //clear input

  listenClicks();
});

//so add-button fires after <enter> key pressed
input.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    btnAdd.click();
  }
});

//add click listener to list element
const listenClicks = () => {
  items = document.getElementsByClassName("item");

  for (let i = 0; i < items.length; i++) {
    items[i].addEventListener("click", (e) => {
      e.stopImmediatePropagation();

      e.target.classList.toggle("selected");

      addPosToDelete();
    });
  }
};

// simple validation
const validate = (str) => {
  let delimeterPos = null;
  if (str.includes("=")) {
    delimeterPos = str.indexOf("=");
  } else {
    input.value = "";
    return;
  }
  if (str.substring(0, delimeterPos).trim() === "") {
    input.value = "";
    return;
  }
  if (str.substring(delimeterPos + 1).trim() === "") {
    input.value = "";
    return;
  }
  return true;
};

// divides input in 2 parts (before'=' and after'=') and pushes an object(name/value) to array
const parseInput = (input) => {
  const delimeterPos = input.indexOf("=");

  const name = input.substring(0, delimeterPos);
  const value = input.substring(delimeterPos + 1);
  listArr.push({ name, value });
};

// sort by name button
btnSortName.addEventListener("click", () => {
  listArr.sort(sortName);

  //to sort html collection
  let lc = list.children;
  [].slice
    .call(lc)
    .sort((a, b) => {
      if (
        a.textContent.substring(0, a.textContent.indexOf("=")) >
        b.textContent.substring(0, b.textContent.indexOf("="))
      )
        return 1;
      if (
        a.textContent.substring(0, a.textContent.indexOf("=")) <
        b.textContent.substring(0, b.textContent.indexOf("="))
      )
        return -1;
      return 0;
    })
    .forEach((val) => {
      list.appendChild(val);
    });

  addPosToDelete();
});

// sort by value button
btnSortValue.addEventListener("click", () => {
  listArr.sort(sortValue);
  console.log(
    list.children[0].textContent.substring(
      list.children[0].textContent.indexOf("=") + 1
    )
  );
  //to sort html collection
  let lc = list.children;
  [].slice
    .call(lc)
    .sort((a, b) => {
      if (
        a.textContent.substring(a.textContent.indexOf("=") + 1) >
        b.textContent.substring(b.textContent.indexOf("=") + 1)
      )
        return 1;
      if (
        a.textContent.substring(a.textContent.indexOf("=") + 1) <
        b.textContent.substring(b.textContent.indexOf("=") + 1)
      )
        return -1;
      return 0;
    })
    .forEach((val) => {
      list.appendChild(val);
    });

  addPosToDelete();
});

//functions for sorting
const sortName = (a, b) => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
};

const sortValue = (a, b) => {
  if (a.value < b.value) return -1;
  if (a.value > b.value) return 1;
  return 0;
};

btnDelete.addEventListener("click", () => {
  if (list.children.length > 0 && clickedElementPosArr.length > 0) {
    console.log(list.children);

    //mark selected elements with 'remove' className  (DOM elements)
    for (let i = 0; i < clickedElementPosArr.length; i++) {
      list.children[clickedElementPosArr[i]].className = "remove";
    }
    //remove elements marked as 'remove'
    for (let i = list.children.length - 1; i >= 0; i--) {
      if (list.children[i].className === "remove") {
        list.children[i].remove();
        itemsCount--;
      }
    }
    //next 2 loops do the same as previous ones but for array of objects
    for (let i = 0; i < clickedElementPosArr.length; i++) {
      listArr[clickedElementPosArr[i]].name = "remove";
    }

    for (let i = listArr.length - 1; i >= 0; i--) {
      if (listArr[i].name === "remove") {
        listArr.splice(i, 1);
      }
    }

    //clear array of positions of eletents to be deleted
    clickedElementPosArr.splice(0, clickedElementPosArr.length);
  }
  // to add proper classname to elements according to their new position
  for (let i = 0; i < list.children.length; i++) {
    list.children[i].className = `item item-${i + 1}`;
  }
});

//creates an array of positions of items to be deleted (updates after sort)
const addPosToDelete = () => {
  clickedElementPosArr.splice(0, clickedElementPosArr.length);
  console.log("clickedElementPosArr", clickedElementPosArr);
  for (let i = 0; i < list.children.length; i++) {
    console.log(list.children[i]);

    if (list.children[i].className.includes("selected")) {
      clickedElementPos = i;
      if (typeof clickedElementPos === "number") {
        //otherwise pushes null

        if (!clickedElementPosArr.includes(clickedElementPos))
          clickedElementPosArr.push(clickedElementPos);
      }
    }
  }
};

btnXml.addEventListener("click", () => {
  modal.classList.remove("hidden");
  //showing element dom representation inside modal
  for (let i = 0; i < list.children.length; i++) {
    let p = document.createElement("p");
    p.textContent = list.children[i].outerHTML;
    modal.append(p);
  }
});

//close button (cross) on the modal
close.addEventListener("click", () => {
  modal.classList.add("hidden"); //make modal visible

  //clear nodes representation array so they correspond to the current state of the page
  let paragraphs = document.getElementsByTagName("p");

  for (let i = paragraphs.length - 1; i >= 0; --i) {
    paragraphs[i].remove();
  }
});
