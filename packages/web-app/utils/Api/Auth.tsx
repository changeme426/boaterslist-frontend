interface SignInUser {
    username: string;
    password: number;
}

export const SignInRequest = (params: SignInUser) => {
  //TODO SIGN IN REQUEST
    const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    };

    return fetch(`${process.env.NEXT_PUBLIC_BL_BACKEND_API}/account/sign-in`, settings);
}

interface SignUpUser {
    email: string;
    familyName: string;
    givenName: string;
    password: string;
    role: string;
}
export const SignUpRequest = (params: SignUpUser) => {
  //TODO SIGN UP REQUEST
    const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    };
    return fetch(`${process.env.NEXT_PUBLIC_BL_BACKEND_API}/account/sign-up`, settings);
}

export const ForgotPasswordRequest = (params: SignUpUser) => {
  const settings = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
  };
  return fetch(`${process.env.NEXT_PUBLIC_BL_BACKEND_API}/account/change-password`, settings);
}
