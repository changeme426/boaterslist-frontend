import { atom } from "recoil";

export const userCurrentLocationState = atom({
  key: "userCurrentLocationState",
  default: [] as number[],
});
