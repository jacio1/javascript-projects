const form = document.querySelector("[data-search-form]");
const input = document.querySelector("[data-search-input]");
const userInfoContainer = document.querySelector("[data-user-info-container]");
const reposContainer = document.querySelector("[data-repos-container]");

const API_GITHUB = "https://api.github.com/users";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = input.value.trim();

  if (!username) {
    alert("Введите имя пользователя GitHub");
    return;
  }

  userInfoContainer.innerHTML = `<p>Загрузка...</p>`;
  reposContainer.innerHTML = "";

  try {
    const userResponse = await fetch(`${API_GITHUB}/${username}`);
    if (!userResponse.ok) throw new Error("Пользователь не найден");

    const userData = await userResponse.json();

    userInfoContainer.innerHTML = `
    <div class="user-info">
    <img src=${userData.avatar_url} alt="${userData.login}"/>
    <h2>${userData.name || userData.login}</h2>
    <p>${userData.bio || "Нет информации о биографии"}</p>
    </div>`;

    const reposResponse = await fetch(userData.repos_url);
    if (!reposResponse.ok) {
      throw new Error("Не удалось получить данные о репозиториях");
    }

    const repos = await reposResponse.json();
    if (repos.length) {
      reposContainer.innerHTML = `<h3>Репозитории: </h3>`;

      repos.forEach((repo) => {
        reposContainer.innerHTML += `
            <div class="repo">
            <a href="${repo.html_url}" target="_blank">${repo.name}</a></div>`;
      });
    } else {
      reposContainer.innerHTML = `<p>Репозитории не найдены</p>`;
    }
  } catch (error) {
    userInfoContainer.innerHTML = `<p>${error.message}</p>`;
  }
});
