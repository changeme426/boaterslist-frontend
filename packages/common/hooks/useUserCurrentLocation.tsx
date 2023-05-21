import { useRecoilState } from "recoil";
import { userCurrentLocationState } from "../atoms/userCurrentLocationState";

export const useUserCurrentLocation = () => {
  const [userCurrentLocation, setUserCurrentLocation] = useRecoilState<number[]>(userCurrentLocationState);

  function addUserCurrentLocation(userLoc: Array<number>) {
    setUserCurrentLocation(userLoc);
  }

  return { userCurrentLocation, addUserCurrentLocation };
}
