const createUserForm = document.querySelector(".form");
const usersContainer = document.querySelector(".users-container");
const editUserFormDialog = document.querySelector(".edit-form-dialog");

const MOCK_API_URL = "https://689af64ce727e9657f63372a.mockapi.io/users";
let users = [];

usersContainer.addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-user-remove-btn")) {
    const isRemoveUser = confirm("Вы точно хотите удалить пользователя?");
    isRemoveUser && removeExistingUserAsync(e.target.dataset.userId);
    return;
  }

  if (e.target.hasAttribute("data-user-edit-btn")) {
    populateDialog(e.target.dataset.userId);
    editUserFormDialog.showModal();
  }
});

createUserForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(createUserForm);
  const formUserData = Object.fromEntries(formData);

  const newUserData = {
    name: formUserData.userName,
    city: formUserData.userCity,
    email: formUserData.userEmail,
    avatar: formUserData.userImageUrl,
  };

  createNewUserAsync(newUserData);
});

const editExistingUserAsync = async (newUserData) => {
  try {
    const response = await fetch(`${MOCK_API_URL}/${newUserData.id}`, {
      method: "PUT",
      body: JSON.stringify(newUserData),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (response.status === 400) {
      throw new Error("клиенсткаяя ошибка");
    }

    const editedUser = await response.json();

    users = users.map((user) => {
      if (user.id === editedUser.id) {
        return editedUser;
      }
      return user;
    });
    editUserFormDialog.close();
    renderUsers();

    alert("Пользователь успешно отредактирован!");
  } catch (error) {
    console.error("Ошибка в редактировании пользователя", error.message);
  }
};

const removeExistingUserAsync = async (userId) => {
  try {
    const response = await fetch(`${MOCK_API_URL}/${userId}`, {
      method: "DELETE",
    });

    if (response.status === 404) {
      throw new Error(`${userId} не найден`);
    }

    const removedUser = await response.json();

    users = users.filter((user) => user.id !== removedUser.id);

    renderUsers();

    alert("Пользователь успешно удален!");
  } catch (error) {
    console.error("Ошибка при удалении пользователя", error.message);
  }
};

const createNewUserAsync = async (newUserData) => {
  try {
    const response = await fetch(MOCK_API_URL, {
      method: "POST",
      body: JSON.stringify(newUserData),
      headers: {
        "Content-type": "application/json",
      },
    });
    const newCreatedUser = await response.json();

    users.unshift(newCreatedUser);
    renderUsers();

    createUserForm.reset();
    alert("Новый пользователь успешно создан");
  } catch (error) {
    console.error("Ошибка при создании нового пользователя", error.message);
  }
};

const getUsersAsync = async () => {
  try {
    const response = await fetch(MOCK_API_URL);
    users = await response.json();

    renderUsers();
  } catch (error) {
    console.error("Ошибка при получении пользователей", error.message);
  }
};

const renderUsers = () => {
  usersContainer.innerHTML = "";

  users.forEach((user) => {
    usersContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="user-card">
        <h3>Имя: ${user.name}</h3>
        <p>Город: ${user.city}</p>
        <span>Email: ${user.email}</span>
        <img src="${user.avatar}"/>
        <button class="btn-edit" data-user-id="${user.id}" data-user-edit-btn>Edit</button>
        <button class="btn-remove" data-user-id="${user.id}" data-user-remove-btn>Remove</button>
        </div>`
    );
  });
};

const populateDialog = (userId) => {
  editUserFormDialog.innerHTML = "";

  const editForm = document.createElement("form");
  const closeFormBtn = document.createElement("button");

  closeFormBtn.classList.add("close-edit-form-btn");
  closeFormBtn.textContent = "X";
  closeFormBtn.addEventListener("click", () => editUserFormDialog.close());

  editForm.addEventListener("submit", () => {
    e.preventDefault();
    const formData = new FormData(editForm);
    const formUserData = Object.fromEntries(formData);

    const newUserData = {
      id: formUserData.userId,
      name: formUserData.userName,
      city: formUserData.userCity,
      email: formUserData.userEmail,
      avatar: formUserData.userImageUrl,
    };

    editExistingUserAsync(newUserData);
  });

  editForm.classList.add("form");
  editForm.innerHTML = `
 <input type='text' name'userId' value="${userId}" hidden/>

   <div class="control-field">
              <label for="nameId" class="form-label">Имя</label>
              <input
                type="text"
                class="form-control"
                id="nameId"
                name="userName"
                required
              />
            </div>
            <div class="control-field">
              <label for="cityId" class="form-label">Город</label>
              <input
                type="text"
                class="form-control"
                id="cityId"
                name="userCity"
                required
              />
            </div>
            <div class="control-field">
              <label for="emailId" class="form-label">Email</label>
              <input
                type="email"
                class="form-control form-control--email"
                id="emailId"
                name="userEmail"
                required
              />
            </div>
            <div class="control-field">
              <label for="imagesUrlId" class="form-label">Иззображение</label>
              <select
                name="userImageUrl"
                id="imagesUrlId"
                class="form-control form-control--images"
                required
              >
                <option value="">IMAGE URL</option>
                <hr />
                <option
                  value="http://images-s.kinorium.com/movie/shot/10108635/w1500_52075273.jpg"
                >
                  1 URL
                </option>
                <option
                  value="https://shikimori.one/system/user_images_h/original/af4713631e3a0d3417f1fcae/83edf9eb4b39933dd7f283c32fc26e7b48592e0493b4863a4b23bd3ceae7efb5.jpg"
                >
                  2 URL
                </option>
              </select>
            </div>
            <button type="submit" class="submit-btn">Отредактировать пользователя</button>`;

  editUserFormDialog.append(editForm, closeFormBtn);
};

getUsersAsync();
