import {
  getDateRepresentation,
  getTodosFromLocalStorage,
  saveTodosIntoLocalStorage,
} from "./utils.js";

const addTodoInput = document.querySelector(".add-todo-input");
const addTodoBtn = document.querySelector(".add-todo-btn");
const todosContainer = document.querySelector(".todo-list-container");
const todoTemplate = document.querySelector(".todo-template");
const searchTodoInput = document.querySelector(".search-todo-input");

let todoList = getTodosFromLocalStorage();
let filteredTodosList = [];

addTodoBtn.addEventListener("click", () => {
  if (addTodoInput.value.trim()) {
    const newTodo = {
      id: Date.now(),
      text: addTodoInput.value.trim(),
      completed: false,
      createdAt: getDateRepresentation(new Date()),
    };
    todoList.push(newTodo);
    addTodoInput.value = "";
    saveTodosIntoLocalStorage(todoList);
    renderTodos();
  }
});

addTodoInput.addEventListener("input", () => {
  if (searchTodoInput.value.trim()) {
    searchTodoInput.value = "";
    renderTodos();
  }
});

searchTodoInput.addEventListener("input", (e) => {
  const searchValue = e.target.value.trim();

  filterAndRenderFilteredTodos(searchValue);
});

const filterAndRenderFilteredTodos = (searchValue) => {
  filteredTodosList = todoList.filter((t) => {
    return t.text.includes(searchValue);
  });
  renderFilteredTodo();
};
const createTodoLayout = (todo) => {
  const todoElement = document.importNode(todoTemplate.content, true);

  const checkbox = todoElement.querySelector(".todo-checkbox");
  checkbox.checked = todo.completed;

  const todoText = todoElement.querySelector(".todo-text");
  todoText.textContent = todo.text;

  const todoCreatedDate = todoElement.querySelector(".todo-created-date");
  todoCreatedDate.textContent = todo.createdAt;

  const removeTodoBtn = document.querySelector(".remove-todo-btn");
  removeTodoBtn.disabled = !todo.completed;

  checkbox.addEventListener("change", (e) => {
    todoList = todoList.map((t) => {
      if (t.id === todo.id) {
        t.completed = e.target.checked;
      }
      return t;
    });
    saveTodosIntoLocalStorage(todoList);

    if (searchTodoInput.value.trim()) {
      filterAndRenderFilteredTodos(searchTodoInput.value.trim());
    } else {
      renderTodos();
    }
  });

  removeTodoBtn.addEventListener("click", () => {
    todoList = todoList.filter((t) => {
      if (t.id !== todo.id) {
        return t;
      }
    });
    saveTodosIntoLocalStorage(todoList);

    if (searchTodoInput.value.trim()) {
      filterAndRenderFilteredTodos(searchTodoInput.value.trim());
    } else {
      renderTodos();
    }
  });

  return todoElement;
};

const renderFilteredTodo = () => {
  todosContainer.innerHTML = "";
  if (filteredTodosList.length === 0) {
    todosContainer.innerHTML = "<h3>Не найдено...</h3>";
    return;
  }
  filteredTodosList.forEach((todo) => {
    const todoElement = createTodoLayout(todo);
    todosContainer.append(todoElement);
  });
};

const renderTodos = () => {
  if (todoList.length === 0) {
    todosContainer.innerHTML = "<h3>Нет задач...</h3>";
    return;
  }
  todosContainer.innerHTML = "";
  todoList.forEach((todo) => {
    const todoElement = createTodoLayout(todo);
    todosContainer.append(todoElement);
  });
};

renderTodos();
