import { useRecoilState } from "recoil";
import { usePreviousSearchState } from "../atoms/usePreviousSearchState";

export const usePreviousSearch = () => {
  const [prevSearch, setPrevSearch] = useRecoilState<any>(usePreviousSearchState);

  function addSearch(userLoc: any) {
    setPrevSearch(userLoc);
  }

  return { prevSearch, addSearch };
}
