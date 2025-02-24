import { generateHomepageHTML, init as initHomepage, setTheme } from './homepage.js'
import { getData, initTime, addHandlerTasks } from './model.js'
import { renderStatsHTML, isDesktopView } from './stats.js'
import { openTaskView, generateTaskView } from './viewTask.js'
import { generateAddTaskHTML } from './createTask.js';

import './styles/main.css';
import './styles/themes.css';

//load the data from localStorage as soon as page loads
getData();

function generateMarkup() {
  generateHomepageHTML();
  generateAddTaskHTML();
  generateTaskView();
  renderStatsHTML();
  initHomepage();
  initTime();

  //initialize the listener when the page loads
  addHandlerTasks(openTaskView);
  //load theme
  setTheme();

  //check if desktop
  isDesktopView();
}

function init() {
  generateMarkup();
  
}

init();