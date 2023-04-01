// -----> based on this value we can figure out that is the theme light or dark
let isLight = true;

// -----> this array contain all the task
const allTask = [];

// -----> targeting element from document object
const htmlTag = document.querySelector(`html`);
const popup = document.querySelector(`.popup`);
const themeSwitch = document.querySelector(`.themeSwitch`);
const themeSwitchIcon = document.querySelector(`.themeSwitch__icon`);
const themeSwitchIconContent =
  document.querySelector(`.themeSwitch__icon`).firstElementChild;
const themeSwitchCaption = document.querySelector(`.themeSwitch__caption`);
const inputField = document.querySelector(`.inputContainer__inputField`);
const inputButton = document.querySelector(`.inputContainer__btn`);
const taskConntainer = document.querySelector(`.taskContainer`);
const emptyTaskContainer = document.querySelector(`.taskContainer__noTask`);

// -----> invoke this function to set an element's attribute
const setElementAttribute = (element, attribute, attributeValue) => {
  element.setAttribute(attribute, attributeValue);
};

// -----> invoke this function to toggle classname
const toggleClassName = (element, className) => {
  element.classList.toggle(className);
};

// -----> invoke this function to change the theme into dark
const invokeIfDark = () => {
  setElementAttribute(htmlTag, `theme`, `dark`);
  toggleClassName(themeSwitchIcon, `themeSwitch__icon--dark`);
  toggleClassName(themeSwitchCaption, `themeSwitch__caption--dark`);
  setElementAttribute(
    themeSwitchIconContent,
    `href`,
    `public/images/spriteSvg.svg#icon-moon`
  );
  themeSwitchCaption.textContent = `dark`;
  localStorage.setItem(`theme`, `dark`);
  isLight = false;
};
// -----> invoke this function to change the theme into light
const invokeIfLight = () => {
  setElementAttribute(htmlTag, `theme`, `light`);
  toggleClassName(themeSwitchIcon, `themeSwitch__icon--dark`);
  toggleClassName(themeSwitchCaption, `themeSwitch__caption--dark`);
  setElementAttribute(
    themeSwitchIconContent,
    `href`,
    `public/images/spriteSvg.svg#icon-sun`
  );
  themeSwitchCaption.textContent = `light`;
  localStorage.setItem(`theme`, `light`);
  isLight = true;
};

// -----> whene there are no task in the task container active no task panel
const noTask = () => {
  allTask.length <= 0
    ? emptyTaskContainer.classList.add(`taskContainer__noTaskActive`)
    : emptyTaskContainer.classList.remove(`taskContainer__noTaskActive`);
};

// -----> this function create elements for task item and return array filled with elements
const createTaskItemElement = () => {
  // -----> these element are necessary in order to create a task item
  const taskElements = [`li`, `span`, `div`];
  return taskElements.map((value) => {
    return document.createElement(value);
  });
};

// -----> this function create a task item and add it to the task container
const createTaskItem = (itemNode) => {
  const taskItemElements = createTaskItemElement();
  const taskItemElementsWithAttributes = taskItemElements.map((value) => {
    switch (value.tagName) {
      case "LI":
        setElementAttribute(value, `class`, `taskContainer__item`);
        break;
      case "SPAN":
        setElementAttribute(value, `class`, `taskContainer__node`);
        const taskNode = document.createTextNode(itemNode);
        value.appendChild(taskNode);
        allTask.push(itemNode);
        localStorage.setItem(`task`, JSON.stringify(allTask));
        break;
      case "DIV":
        setElementAttribute(value, `class`, `taskContainer__icon`);
        value.addEventListener(`click`, () => {
          allTask.forEach((value, index) => {
            if (value === itemNode) {
              allTask.splice(index, 1);
            }
          });
          allTask.length <= 0
            ? localStorage.removeItem(`task`)
            : localStorage.setItem(`task`, allTask);
          noTask();
          taskConntainer.removeChild(taskItemElements[0]);
        });
        break;
    }
    return value;
  });
  // -----> these varriable helps to append the elements
  let liElement = null;
  taskItemElementsWithAttributes.forEach((value) => {
    if (value.tagName === `LI`) {
      liElement = value;
    } else {
      liElement.appendChild(value);
    }
  });
  // -----> adding the task item on the webpage
  taskConntainer.appendChild(liElement);
};

// -----> changing the theme when user click on the theme switch button
themeSwitch.addEventListener(`click`, () => {
  if (isLight) {
    invokeIfDark();
  } else {
    invokeIfLight();
  }
});

// -----> event listener when user click on input button
inputButton.addEventListener(`click`, () => {
  if (inputField.value <= 0) {
    toggleClassName(popup, `popupActive`);
  } else {
    createTaskItem(inputField.value);
    noTask();
    // -----> clearing the input field after adding task
    inputField.value = ``;
  }
});

// -----> event listener for closing the popup
popup.addEventListener(`click`, () => {
  toggleClassName(popup, `popupActive`);
});

// -----> changing theme from local storage
if (localStorage.getItem(`theme`) === `dark`) {
  invokeIfDark();
}

// -----> adding task element from local storage
const checkLocalValue = () => {
  const localValue = localStorage.getItem(`task`);
  if (localValue === null) {
    noTask();
  } else {
    let abc = JSON.parse(localValue);
    abc.forEach((value) => {
      createTaskItem(value);
    });
  }
};
checkLocalValue();
