import { useRecoilState } from "recoil";
import { userLocationState, userGrantLocation } from "../atoms/userLocationState";

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useRecoilState(userLocationState);
  const [userLocationEnabled, setUserLocationEnabled] = useRecoilState(userGrantLocation);

  function addUserLocation(userLoc: Array<number>) {
    setUserLocation(userLoc as any);
  }

  function addUserLocationEnabled(userEnabledLoc: boolean) {
    setUserLocationEnabled(userEnabledLoc);
  }

  return { userLocation, addUserLocation, userLocationEnabled, addUserLocationEnabled };
}
