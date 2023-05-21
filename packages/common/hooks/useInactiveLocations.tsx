import { useRecoilState } from "recoil";
import { useInactiveLocationsState } from "../atoms/useInactiveLocationsState";

export const useInactiveLocations = () => {
  const [isInactive, setIsInactive] = useRecoilState(useInactiveLocationsState);

  function showInactive(value: boolean) {
    setIsInactive(value);
  }

  return { isInactive, showInactive };
}
