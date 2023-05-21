import { atom } from "recoil";

export const userLocationState = atom({
  key: "userLocationState",
  default: [],
});

export const userGrantLocation = atom({
  key: "userGrantLocation",
  default: false,
});
