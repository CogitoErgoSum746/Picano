// IP or Domain of API endpoint.
const baseURL = 'http://localhost:8000';

export const API = {
    dropdownFilter: (field='', id='', value='') => Boolean(field) ? `${baseURL}/auto-dropdown?${field}[id]=${id}&${field}[value]=${value}` : `${baseURL}/auto-dropdown`,
    vision: `${baseURL}/vision`,
    productCategories: `${baseURL}/product_category`
}
