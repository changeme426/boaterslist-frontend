import {useRecoilState} from "recoil";
import { userState } from "../atoms/userState";

export const useSignIn = () => {
    const [user, setUser] = useRecoilState<any>(userState);

    function addUser(userData:any){
        setUser(userData);
    }

    function addUserProfile(userDetails: any){
        setUser((prevState:any) => ({
            ...prevState,
            userDetails
        }));
    }

    return { user, addUser, addUserProfile };
}
