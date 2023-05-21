export const getProviderResults = (params: string) => {
  const settings = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  };
  
  return fetch(`${process.env.NEXT_PUBLIC_BL_BACKEND_API}/providers?filter=${params}`, settings);
}

export const getUserAgents = (token: string) => {
  const settings = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      }
  };

  return fetch(`${process.env.NEXT_PUBLIC_BL_BACKEND_API}/users/agents`, settings);
}
