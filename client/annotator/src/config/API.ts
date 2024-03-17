// IP or Domain of API endpoint.

import { Product } from "../app/app.services";

// const baseURL = 'http://localhost:8000';
const baseURL = 'http://161.97.78.88/api';

export const API = {
    dropdownFilter: (field='', id='', value='') => Boolean(field) ? `${baseURL}/auto-dropdown?${field}[id]=${id}&${field}[value]=${value}` : `${baseURL}/auto-dropdown`,
    login: `${baseURL}/auth/login`,
    vision: `${baseURL}/vision`,
    submit: `${baseURL}/finalCSV`,
    pdfToImages: `${baseURL}/pdf-to-images`,
    productCategories: `${baseURL}/product_category`,

    // similarProducts creates a url with query params 
    // generated from the product object.
    similarProducts: (product: Product) => {
        const queryString = new URLSearchParams(product as any);
        return `${baseURL}/similar-products?${queryString.toString()}`;
    } 
}
