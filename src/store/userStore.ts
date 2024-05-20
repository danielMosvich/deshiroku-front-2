import { atom } from "nanostores";

// Definir átomos con tipos específicos
export const STORE_username = atom<string | null>(null);
export const STORE_name = atom<string | null>(null);
export const STORE_user = atom<object | null>(null);
export const STORE_defaultCollection = atom<object | null>(null);
export const STORE_location = atom<string>("/");
export const STORE_auth_modal = atom<boolean>(false);
export const STORE_global_volume = atom<number>(0);
