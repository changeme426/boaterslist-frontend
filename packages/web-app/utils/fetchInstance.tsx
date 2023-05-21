import Cookies from "js-cookie";

const originalRequest = async (url: string, config: any) => {
  let response = await fetch(`${process.env.NEXT_PUBLIC_BL_BACKEND_API}${url}`, config);
  let data;
  if(response.status === 204){
    data = null;
  }else{
    data = await response.json();
  }
  return { response, data };
};

const customFetcher = async (url: string, config: any) => {
  const authUser = Cookies.get("user")
    ? JSON.parse(Cookies.get("user") as string)
    : null;
  let token = "";
  let isExpired = false;
  if (authUser && authUser.auth) {
    token = authUser.auth.access_token;

    if (Cookies.get("expireToken")) {
      const cookieDate = Cookies.get("expireToken") || "";
      const expireDate = new Date(cookieDate);
      const dateNow = new Date();
      if (dateNow.getTime() >= expireDate.getTime()) {
        isExpired = true;
      }
    }
  }
  if (isExpired) {
    window.location.href = "/";
    Cookies.remove("user");
    Cookies.remove("expireDate");
    return null;
  } else {
    config["headers"] = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    let { response, data } = await originalRequest(url, config);
    return { response, data };
  }
};

export default customFetcher;
