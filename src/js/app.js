import WorkDislay from './WorkDisplay.js';
import initData from './initData.js';
import Storage from './Storage.js';

const storage = new Storage();
const workDisplay = new WorkDislay();

let draggedEl = null;
let ghostEl = null;
let elWidth;
let elHeight;
let elTop;
let elLeft;
const elTasks = document.querySelector('#tasks');

function elDragDrop(event, element) {
  const closest = document.elementFromPoint(event.clientX, event.clientY);
  const { top } = closest.getBoundingClientRect();

  if (closest.classList.contains('item-task')) {
    if (event.pageY > window.scrollY + top + closest.offsetHeight / 2) {
      closest.closest('.item-tasks').insertBefore(element, closest.nextElementSibling);
    } else {
      closest.closest('.item-tasks').insertBefore(element, closest);
    }
  } else if (closest.classList.contains('item-tasks') && !closest.querySelector('.item-task')) {
    closest.append(element);
  }
}

function toObjectTasks() {
  const toDoTasks = document.querySelectorAll('#todo .item-tasks .item-task');
  const inProgressTasks = document.querySelectorAll('#in-progress .item-tasks .item-task');
  const doneTasks = document.querySelectorAll('#done .item-tasks .item-task');

  const objTasks = {
    todo: [],
    inProgress: [],
    done: [],
  };

  for (const item of toDoTasks) {
    objTasks.todo.push(item.textContent.replace(' ✖', ''));
  }

  for (const item of inProgressTasks) {
    objTasks.inProgress.push(item.textContent.replace(' ✖', ''));
  }

  for (const item of doneTasks) {
    objTasks.done.push(item.textContent.replace(' ✖', ''));
  }
  storage.save(objTasks);
}

document.addEventListener('DOMContentLoaded', () => {
  const storageData = JSON.parse(storage.load());
  if (storageData !== null) {
    workDisplay.initTasks(storageData);
  } else {
    workDisplay.initTasks(initData());
  }
});

// mousedown
elTasks.addEventListener('mousedown', (event) => {
  // event.preventDefault();
  // открыть добавление новой задачи
  if (event.target.classList.contains('add-task')) {
    event.target.parentNode.querySelector('.input-task').classList.remove('hidden');
    event.target.classList.add('hidden');

    // отмена добавления задачи
  } else if (event.target.classList.contains('b-cancel-task')) {
    event.target.closest('.col-tasks').querySelector('.add-task').classList.remove('hidden');
    event.target.parentNode.classList.add('hidden');

    // добавить новую задачу
  } else if (event.target.classList.contains('b-add-task')) {
    const elAddTask = event.target.closest('.col-tasks').querySelector('.item-tasks');
    const elInput = event.target.closest('.input-task').querySelector('#text-task');
    workDisplay.addTask(elAddTask, elInput.value);
    elInput.value = '';
    event.target.closest('.col-tasks').querySelector('.add-task').classList.remove('hidden');
    event.target.parentNode.classList.add('hidden');
    toObjectTasks();

    // удалить текущую задачу
  } else if (event.target.classList.contains('del-task')) {
    const itemDel = event.target.parentNode;
    itemDel.parentNode.removeChild(itemDel);
    toObjectTasks();

    // начало перемещения задачи
  } else if (event.target.classList.contains('item-task')) {
    event.preventDefault();
    event.target.querySelector('.del-task').classList.add('hidden');
    const { top, left } = event.target.getBoundingClientRect();
    draggedEl = event.target;
    elWidth = draggedEl.offsetWidth;
    elHeight = draggedEl.offsetHeight;
    elLeft = event.pageX - left;
    elTop = event.pageY - top;

    ghostEl = event.target.cloneNode(true);
    ghostEl.innerHTML = '';
    ghostEl.style.backgroundColor = 'grey';
    ghostEl.style.width = `${elWidth}px`;
    ghostEl.style.height = `${elHeight}px`;

    draggedEl.classList.add('dragged');
    event.target.parentNode.insertBefore(ghostEl, event.target.nextElementSibling);

    draggedEl.style.left = `${event.pageX - elLeft}px`;
    draggedEl.style.top = `${event.pageY - elTop}px`;
    draggedEl.style.width = `${elWidth}px`;
    draggedEl.style.height = `${elHeight}px`;
  }
});

// mouseleave
elTasks.addEventListener('mouseleave', (event) => {
  if (draggedEl) {
    event.preventDefault();
    ghostEl.parentNode.removeChild(ghostEl);
    draggedEl.classList.remove('dragged');
    draggedEl.style = '';
    ghostEl = null;
    draggedEl = null;
  }
});

// mousemove
elTasks.addEventListener('mousemove', (event) => {
  if (draggedEl) {
    event.preventDefault();
    elDragDrop(event, ghostEl);
    draggedEl.style.left = `${event.pageX - elLeft}px`;
    draggedEl.style.top = `${event.pageY - elTop}px`;
  }
});

// mouseup
elTasks.addEventListener('mouseup', (event) => {
  if (draggedEl) {
    elDragDrop(event, draggedEl);

    ghostEl.parentNode.removeChild(ghostEl);
    draggedEl.classList.remove('dragged');
    draggedEl.style = '';
    ghostEl = null;
    draggedEl = null;

    toObjectTasks();
  }
});
