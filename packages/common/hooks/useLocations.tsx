import { useRecoilState } from "recoil";
import { locationsState } from "../atoms/locationsState";
import { ILocationsResponse } from "../models/ILocationsResponse";

export const useLocations = () => {
  const [locations, setLocations] = useRecoilState(locationsState);

  function addLocations(location: ILocationsResponse) {
    setLocations(location);
  }

  return { locations, addLocations };
}
