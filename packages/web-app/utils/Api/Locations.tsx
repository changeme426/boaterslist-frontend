export const LocationsDetail = (id: string) => {
    const defaultParams = JSON.stringify({"include":[{"relation":"company","scope":{"fields":{"companyId":true,"companyName":true}}},{"relation":"subCategories","scope":{"fields":{"subCategoryName":true,"subCategoryId":true}}}]});
    const settings = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    return fetch(`${process.env.NEXT_PUBLIC_BL_BACKEND_API}/locations/${id}?filter=${defaultParams}`, settings);
}