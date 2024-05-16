import { atom } from "nanostores";

// Definir átomos
export const username = atom("");
export const name = atom("");
export const id = atom("");
export const collections = atom([]);
export const defaultCollection = atom({});

// Recuperar el valor de defaultCollection desde localStorage si está disponible
// const storedDefaultCollection = window.localStorage.getItem("defaultCollection");
// if (storedDefaultCollection) {
//   defaultCollection.set(JSON.parse(storedDefaultCollection));
// }

// Suscribirse a cambios en defaultCollection y actualizar localStorage

