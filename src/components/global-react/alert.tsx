// import React, { useEffect, useRef } from "react";
// import ReactDOM from "react-dom";

type typeAlert = "success" | "danger" | "error";
type positionAlert =
  | "top"
  | "bottom"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

/**
 * Muestra una alerta en la interfaz de usuario.
 * 
 * @param position - La posición de la alerta (e.g., "bottom", "top").
 * @param duration - La duración en milisegundos durante la cual la alerta será visible.
 * @param type - El tipo de alerta (e.g., "success", "error").
 * @param title - El título de la alerta.
 * @param message - El mensaje detallado de la alerta.
 */
function Alert(
  position: positionAlert = "top",
  duration: number = 3000,
  type: typeAlert = "success",
  message: string,
  description?: string
) {
  // Eliminar alertas anteriores
  const removePreviousAlerts = () => {
    const previousAlert = document.querySelector(".alert-1-container");
    if (previousAlert) {
      previousAlert.remove();
    }
  };

  // Crear contenedor de alerta
  const createAlertContainer = () => {
    const container = document.createElement("div");
    container.className = `alert-1-container alert-1-bg-${type}`;

    // Establecer posición
    switch (position) {
      case "top":
      case "bottom":
        container.style.top = position === "top" ? "30px" : "";
        container.style.bottom = position === "bottom" ? "30px" : "";
        container.style.left = "0";
        container.style.right = "0";
        container.style.margin = "0 auto";
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

    return container;
  };

  // Crear contenido de alerta
  const createAlertContent = (container: HTMLDivElement) => {
    const iconsByType: { [key in typeAlert]: string } = {
      success: `<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="currentColor" d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83z"/></svg>`,
      error: `<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 12 12"><path fill="currentColor" d="M6 11A5 5 0 1 0 6 1a5 5 0 0 0 0 10m-.75-2.75a.75.75 0 1 1 1.5 0a.75.75 0 0 1-1.5 0m.258-4.84a.5.5 0 0 1 .984 0l.008.09V6l-.008.09a.5.5 0 0 1-.984 0L5.5 6V3.5z"/></svg>`,
      danger: `<svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="currentColor" d="M1 21L12 2l11 19zm11-3q.425 0 .713-.288T13 17q0-.425-.288-.712T12 16q-.425 0-.712.288T11 17q0 .425.288.713T12 18m-1-3h2v-5h-2z"/></svg>`
    };

    const alertTitle = document.createElement("div");
    alertTitle.className = "alert-1-title";

    const alertTitleP = document.createElement("p");
    alertTitleP.innerHTML = message;

    const alertTitleI = document.createElement("i");
    alertTitleI.innerHTML = iconsByType[type];

    alertTitle.append(alertTitleI, alertTitleP);
    container.appendChild(alertTitle);

    if (description) {
      const alertDescription = document.createElement("span");
      alertDescription.className = "alert-1-description";
      alertDescription.innerText = description;
      container.appendChild(alertDescription);
    }

    const iconContainer = document.createElement("i");
    iconContainer.className = "alert-1-icon-close";
    iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1.5rem" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M6.06 3.94a1.5 1.5 0 1 0-2.12 2.12l4.17 4.172a5.5 5.5 0 0 0 7.78 0l4.17-4.171a1.5 1.5 0 0 0-2.12-2.122l-4.172 4.172a2.5 2.5 0 0 1-3.536 0L6.061 3.939Zm0 16.12a1.5 1.5 0 0 1-2.12-2.12l4.17-4.172a5.5 5.5 0 0 1 7.78 0l4.17 4.171a1.5 1.5 0 0 1-2.12 2.122l-4.172-4.172a2.5 2.5 0 0 0-3.536 0l-4.171 4.172Z"/></g></svg>`;
    iconContainer.addEventListener("click", removeAlert);

    container.appendChild(iconContainer);

    document.body.append(container);

    setTimeout(() => {
      removeAlert();
    }, duration);
  };

  // Remover alerta con animación
  const removeAlert = () => {
    const container = document.querySelector(".alert-1-container");
    if (container) {
      container.style.animation = "hidden_down 0.2s ease-in-out forwards";
      container.addEventListener("animationend", function (event) {
        if (event.animationName === "hidden_down") {
          container.remove();
        }
      });
    }
  };

  // Inicialización
  removePreviousAlerts();
  const container = createAlertContainer();
  createAlertContent(container);
}

export default Alert;
