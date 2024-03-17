import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../app.services';
import { CommonModule } from '@angular/common';
import { API } from '../../config/API';

@Component({
  selector: 'app-product-extractor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-extractor.component.html',
  styleUrl: './product-extractor.component.css'
})
export class ProductDetailsUpdator {
    @Input({ required: true }) product!: Product;
    @Input() imageUrl: string | undefined ;

    // Pass the updated product details to parent component
    // to update products array.
    @Output() updateProduct: EventEmitter<Product> = new EventEmitter();

    // Communicate Unauthorised state to parent.
    @Output() authorised: EventEmitter<Boolean> = new EventEmitter();

    // Populate predefined product categories.
    categories: string[] = [];
    similarProducts: Product[] = [];

    // Fetch and populate categories.
    async ngOnInit() {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
            this.authorised.emit(false);
            return;
        }

        const response = await fetch(API.productCategories, {
            headers: { authtoken: jwt }
        });

        if (response.status === 401) {
            this.authorised.emit(false);
            return;
        }

        this.categories = await response.json();
    }

    // handleClick fetches the text for current cropped
    // image and assigns it to the relevant attribute of product.
    async handleClick(event: Event) {
        // Get product attribute.
        const { id: productAttribute } = <HTMLButtonElement>event.target;

        // Convert imageUrl to blob.
        if (!this.imageUrl) return;

        const image = await fetch(this.imageUrl).then(r => r.blob());
        const formData = new FormData();
        formData.append('image', image);

        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
            this.authorised.emit(false);
            return;
        }

        const response = await fetch(API.vision, {
            method: 'POST',
            body: formData,
            headers: {
                authtoken: jwt
            }
        });

        const responseObject = await response.json();
        this.updateProductAttribute(productAttribute, responseObject.text);
    }

    // Called when user manually edits an attribute.
    handleChange(event: Event) {
        const {name, value} = <HTMLInputElement>event.target;
        this.updateProductAttribute(name, value);
    }

    // updateAttribute updates the parent's product state.
    updateProductAttribute(attribute: string, value: any) {
        this.product[attribute as keyof Product] = value;
        this.updateProduct.emit(this.product);

        this.fetchSimilarProducts();
    }

    // fetches similar products with current products details.
    async fetchSimilarProducts() {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
            this.authorised.emit(false);
            return;
        }

        const response = await fetch(API.similarProducts(this.product), {
            method: 'GET',
            headers: {
                authtoken: jwt
            },
        });

        if (response.status === 401) {
            this.authorised.emit(false);
            return;
        }

        const data = await response.json();

        this.similarProducts = data;
    }
}
