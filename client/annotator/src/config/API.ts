// IP or Domain of API endpoint.
const baseURL = 'http://localhost:8000';
// const baseURL = 'http://158.220.90.117/api';

export const API = {
    dropdownFilter: (field='', id='', value='') => Boolean(field) ? `${baseURL}/auto-dropdown?${field}[id]=${id}&${field}[value]=${value}` : `${baseURL}/auto-dropdown`,
    login: `${baseURL}/auth/login`,
    vision: `${baseURL}/vision`,
    submit: `${baseURL}/finalCSV`,
    pdfToImages: `${baseURL}/pdf-to-images`,
    productCategories: `${baseURL}/product_category`,
}
