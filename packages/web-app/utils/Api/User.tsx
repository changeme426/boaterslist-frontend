export const getProfile = (token: string) => {
    const settings = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    
    return fetch(`${process.env.NEXT_PUBLIC_BL_BACKEND_API}/users/profile`, settings);
}

export const getProfileProgress = (token: string) => {
    const settings = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    return fetch(`${process.env.NEXT_PUBLIC_BL_BACKEND_API}/users/profile-status`, settings);
}

export const updateProfile = (params: any, token: string) => {
    const settings = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(params)
    };
    return fetch(`${process.env.NEXT_PUBLIC_BL_BACKEND_API}/users/profile`, settings);
}
