type typeAlert = "success" | "danger" | "error";
type positionAlert =
  | "top"
  | "bottom"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
function Alert(
  position: positionAlert = "top",
  duration: number = 3000,
  type: typeAlert = "success",
  message: string,
  description?: string
) {
  if (document.querySelector(".alert-1-container")) {
    const lastAlert = document.querySelector(".alert-1-container");
    lastAlert?.remove();
  }

  const container = document.createElement("div");
  
  switch (position) {
    case "top":
    case "bottom":
      container.style.top = position === "top" ? "30px" : "";
      container.style.bottom = position === "bottom" ? "30px" : "";
      container.style.left = "0px";
      container.style.right = "0px";
      container.style.margin = "0px auto";
      break;
    case "top-right":
    case "top-left":
    case "bottom-right":
    case "bottom-left":
      container.style.top = position.includes("top") ? "30px" : "";
      container.style.bottom = position.includes("bottom") ? "30px" : "";
      container.style.left = position.includes("left") ? "30px" : "";
      container.style.right = position.includes("right") ? "30px" : "";
      break;
    default:
      break;
  }

  container.classList.add(`alert-1-container`);
  container.classList.add(`alert-1-bg-${type}`)
  const icons_by_type:{ [key in typeAlert]: string } = {
    success:`<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="currentColor" d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83z"/></svg>`,
    error:`<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 12 12"><path fill="currentColor" d="M6 11A5 5 0 1 0 6 1a5 5 0 0 0 0 10m-.75-2.75a.75.75 0 1 1 1.5 0a.75.75 0 0 1-1.5 0m.258-4.84a.5.5 0 0 1 .984 0l.008.09V6l-.008.09a.5.5 0 0 1-.984 0L5.5 6V3.5z"/></svg>`,
    danger:`<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="currentColor" d="M1 21L12 2l11 19zm11-3q.425 0 .713-.288T13 17q0-.425-.288-.712T12 16q-.425 0-.712.288T11 17q0 .425.288.713T12 18m-1-3h2v-5h-2z"/></svg>`
  }

  const alert_title = document.createElement("div");
  const alert_title_p = document.createElement("p");
  const alert_title_i = document.createElement("i");
  alert_title.classList.add("alert-1-title");
  alert_title_p.innerHTML = message;
  alert_title_i.innerHTML = icons_by_type[type]
  alert_title.append(alert_title_i, alert_title_p);
  container.appendChild(alert_title);
  if (description) {
    const alert_description = document.createElement("span");
    alert_description.classList.add("alert-1-description");
    alert_description.innerText = description;
    container.appendChild(alert_description);
  }
  const icon_container = document.createElement("i");
  icon_container.classList.add("alert-1-icon-close");
  icon_container.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1.5rem" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M6.06 3.94a1.5 1.5 0 1 0-2.12 2.12l4.17 4.172a5.5 5.5 0 0 0 7.78 0l4.17-4.171a1.5 1.5 0 0 0-2.12-2.122l-4.172 4.172a2.5 2.5 0 0 1-3.536 0L6.061 3.939Zm0 16.12a1.5 1.5 0 0 1-2.12-2.12l4.17-4.172a5.5 5.5 0 0 1 7.78 0l4.17 4.171a1.5 1.5 0 0 1-2.12 2.122l-4.172-4.172a2.5 2.5 0 0 0-3.536 0l-4.171 4.172Z"/></g></svg>`;

  function removeAlert() {
    container.style.animation = "hidden_down 0.2s ease-in-out forwards";
    container.addEventListener("animationend", function (event) {
      if (event.animationName === "hidden_down") {
        container.remove();
        icon_container.removeEventListener("click", removeAlert);
      }
    });
  }
  icon_container.addEventListener("click", removeAlert);
  container.appendChild(icon_container);
  document.body.append(container);
  setTimeout(() => {
    removeAlert();
  }, duration);
}
export default Alert;
