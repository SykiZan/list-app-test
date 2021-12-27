"use strict";

const input = document.querySelector(".input");

const field = document.querySelector(".list-field");
const list = document.querySelector(".list");

const btnAdd = document.querySelector(".btn-add-pair");
const btnSortName = document.querySelector(".btn-action-sort-name");
const btnSortValue = document.querySelector(".btn-action-sort-value");

const listArr = [];

// this button proceses value from input field
btnAdd.addEventListener("click", () => {
  const isValid = validate(input.value);
  if (!isValid) return;

  let li = document.createElement("li");
  li.textContent = input.value;
  list.append(li);

  parseInput(input.value); // will create array and push an object (name/value)

  input.value = ""; //clear input
});

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

  for (let i = 0; i < list.children.length; i++) {
    list.children[i].textContent = `${listArr[i].name}=${listArr[i].value}`;
  }
});
// sort by value button
btnSortValue.addEventListener("click", () => {
  listArr.sort(sortValue);

  for (let i = 0; i < list.children.length; i++) {
    list.children[i].textContent = `${listArr[i].name}=${listArr[i].value}`;
  }
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
