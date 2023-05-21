export const subCategories = () => {
    const settings = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    return fetch(`${process.env.NEXT_PUBLIC_BL_BACKEND_API}/sub-categories`, settings);
}