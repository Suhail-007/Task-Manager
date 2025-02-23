import icons from './assets/icons.svg';
import { dateContainer } from './homepage.js';
import { updateStats } from './stats.js'
import { monthsArr, weekDaysArr } from './helper.js';
import { openTaskView } from './viewTask.js'

const width = window.matchMedia('(min-width: 1024px)');

export const now = new Date();

let currMonth = now.getMonth();
let currYear = now.getFullYear();
let getMonthTotalDays;
let currDay;
let tasks;

export const nowid = `${currYear}${(now.getMonth() + 1)}${now.getDate()}`;

export let currid = nowid;

export let taskArray = [{
  date: currid,
  content: [
    {
      uid: "0",
      isCompleted: false,
      taskname: "Give me a star ✨",
      taskdesc: "This is an example",
      timestart: "12:00",
      timeend: "13:00",
      time: "Infinity",
      category: "entertainment"
    }
  ]
}];

export let statsData = {
  active: 1,
  complete: 0,
  deleted: 0,
  total: 1,

  unset: 0,
  work: 0,
  education: 0,
  sport: 0,
  social: 0,
  entertainment: 1
};

export let theme = {
  mode: 'default',
};

export function messagePopUp(message, className, time = 1000) {
  const messageCont = document.querySelector('.message');
  const pElem = messageCont.querySelector('p');

  messageCont.classList.add(`${className}`);
  pElem.innerText = `${message}`

  setTimeout(() => {
    messageCont.classList.remove(`${className}`);
  }, time);

  setTimeout(() => pElem.innerText = '', time * 1.3)
}


export function changeMonth(e) {
  const btn = e.target.closest('button');
  const btnDataset = btn?.dataset.btn;
  const dateBtn = dateContainer.querySelector("button");
  if (btnDataset === 'next') {
    btn.classList.add('active');
    if (currMonth < 11) currMonth++;
    else {
      currMonth = 0;
      currYear++;
    }
  }

  if (btnDataset === 'prev') {
    btn.classList.add('active');
    if (currMonth > 0) currMonth--;
    else {
      currMonth = 11;
      currYear--;
    }
  }

  initTime();

  dateContainer.querySelector("button").click();
  dateContainer.scrollLeft = 0;

  if (width.matches) dateContainer.scrollTop = 0;
}

export function initTime() {
  const dashboardMonth = document.querySelector(".month_year h1");
  const dashboardYear = document.querySelector(".month_year span");
  let month = monthsArr[currMonth];
  let day = weekDaysArr[now.getDay()];

  currDay = now.getDate();

  getMonthTotalDays = new Date(now.getFullYear(), currMonth + 1, 0).getDate();

  dashboardMonth.innerHTML = month;
  dashboardYear.innerHTML = currYear;
  createMonthDays();
}

export function createMonthDays() {
  const allBtn = document.querySelectorAll(".date button");
  allBtn.forEach(btn => { btn.remove() });

  for (let i = 1; i < getMonthTotalDays + 1; i++) {

    //get current month days
    const currMonthFullDate = new Date(now.getFullYear(), currMonth, i);

    //get current month week days
    const weekDays = weekDaysArr[currMonthFullDate.getDay()].slice(0, 3);

    //date btns id
    const id = `${currYear}${(currMonth + 1)}${i}`;

    //create date buttons
    const datesBtn = document.createElement("button");
    datesBtn.innerHTML = i;

    //create week days 
    const weekDaysElem = document.createElement("span");

    weekDaysElem.innerHTML = weekDays;
    datesBtn.insertAdjacentElement('beforeend', weekDaysElem);

    datesBtn.id = id;

    datesBtn.addEventListener('click', () => {
      //reassign the currid 
      currid = datesBtn.id;
      currDayActive(datesBtn);
      renderTasks();
      addHandlerTasks(openTaskView);
    });

    datesBtn.classList = "dateBtn";
    dateContainer.appendChild(datesBtn);

    if (i === currDay) {
      dateContainer.scrollLeft = datesBtn.offsetLeft - dateContainer.offsetLeft;
      currDayActive(datesBtn);
      // renderTasks();
      //Scroll to active btn on desktop view
      if (width.matches) dateContainer.scrollTop = datesBtn.offsetTop - dateContainer.offsetTop;
    }
  }
  renderTasks();
}

export function currDayActive(elem) {
  const dateBtns = document.querySelectorAll(".date button");

  dateBtns.forEach(btn => btn.classList = "dateBtn");

  elem.classList.add("active");
}

export function scrollToSection(goTo) {
  if (goTo === 'home') return document.getElementById('schedule').scrollIntoView({ behavior: "smooth" });

  if (goTo === 'stats') return document.getElementById('stats').scrollIntoView({ behavior: "smooth" });
}

export function createNewTask(data) {
  const uniqueid = new Date().getTime().toString();

  statsData.active += 1;
  statsData.total += 1;
  statsData[data.category] += 1;

  const existTask = taskArray.find(task => task.date === currid);

  if (existTask) {
    const content = existTask.content;

    content.push(
    {
      uid: uniqueid,
      isCompleted: false,
      ...data
    });
    renderTasks();

  } else {
    taskArray.push({
      date: currid,
      content: [
        {
          uid: uniqueid,
          isCompleted: false,
          ...data
        }
      ]
    });
    renderTasks();
  }
}

export function renderTasks() {
  const emptyContainer = document.querySelector(".empty-task");

  const completedTaskContParent = document.querySelector("#complete");

  //remove all the pre-added tasks
  const updatedtaskCard = document.querySelectorAll(".task-card");
  updatedtaskCard.forEach(updatedtaskCard => updatedtaskCard.remove());

  const todayDate = taskArray.find(task => task.date === currid);

  //hide the complete task container if there's no task which is completed
  const isCompleted = todayDate?.content.some(task => task.isCompleted === true);

  if (isCompleted) completedTaskContParent.style.display = 'flex';
  else completedTaskContParent.style.display = 'none';

  if (todayDate && todayDate?.content.length !== 0) {

    //hide the empty container
    emptyContainer.style.display = 'none';

    const contentArr = todayDate.content;

    contentArr.forEach(content => createTaskCard(content))
  } else emptyContainer.style.display = "block";
  // generateStats();
  updateStats();
  scrollToSection('home');
  setLocalStorage('tasks', taskArray);
  setLocalStorage('stats', statsData);
}

//create task card
function createTaskCard(content) {
  const tasksContainer = document.querySelector(".task-container");
  const completedTaskCont = document.querySelector(".task-container-completed");

  //check if title is empty or timestart > timeend or timestart === timeend
  const html = `
    <div data-id='${content.uid}' class="task-card">
      <svg>
        <use xlink:href='${icons}#icon-${content.category}'></use>
      </svg>
      <div class="task-content">
        <h2>${content.taskname}</h2>
        <p>${content.taskdesc} </p>
        <span>${content.time}</span>
      </div>
    </div>`

  if (!content.isCompleted) tasksContainer.insertAdjacentHTML('beforeend', html);
  else {
    completedTaskCont.style.display = "flex";
    if (width.matches) completedTaskCont.style.display = "grid";
    completedTaskCont.insertAdjacentHTML('afterbegin', html);

    //select the task user interacting with
    const task = document.querySelector(`[data-id='${content.uid}']`);
    task.classList.add('complete');
  }
}

export function addHandlerTasks(handler) {
  const tasksContainerParent = document.querySelector(".task-container-parent");

  if (!taskArray) return

  const todayDate = taskArray.find(task => task.date === currid);
  const contentArr = todayDate?.content;

  tasksContainerParent.addEventListener('click', e => {

    const id = e.target.closest('.task-card')?.dataset.id;

    contentArr?.forEach(content => {
      if (content.uid === id) {
        handler(content);
      }
    })
  })
}

export function setLocalStorage(key, value) {
  localStorage.setItem(`${key}`, JSON.stringify(value));
}

export function getData() {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const stats = JSON.parse(localStorage.getItem('stats'));

  const themeMode = JSON.parse(localStorage.getItem('theme'));

  taskArray = tasks ? tasks : taskArray;
  statsData = stats ? stats : statsData;
  theme = themeMode ? themeMode : {};
}