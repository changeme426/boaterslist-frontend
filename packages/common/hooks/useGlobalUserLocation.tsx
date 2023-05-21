import { useRecoilState } from "recoil";
import { userGlobalLocationState } from "../atoms/userGlobalLocationState";

export const useGlobalUserLocation = () => {
  const [globalLocation, setGlobalLocation] = useRecoilState<any>(userGlobalLocationState);

  function addUserGlobalLocation(userLoc: any) {
    setGlobalLocation(userLoc);
  }

  return { globalLocation, addUserGlobalLocation };
}
