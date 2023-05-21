export const ResultsLocations = (params: any) => {
    const settings = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    return fetch(`${process.env.NEXT_PUBLIC_BL_BACKEND_API}/locations-categories?customFilter=${params}`, settings);
}