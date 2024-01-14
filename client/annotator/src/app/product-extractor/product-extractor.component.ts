import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../app.services';
import { CommonModule } from '@angular/common';

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
    PRODUCT_LABELS: any = {
        "name": "Product Name",
        "brand": "Brand Name",
        "description": "Product Description",
        "discoutedPrice": "Discounted Product Price",
        "campaignQuantity": "Campaign Quantity",
        "restrictions": "Restrictions",
    };

    // handleClick fetches the text for current cropped
    // image and assigns it to the relevant attribute of product.
    async handleClick(event: Event) {
        // Get product attribute.
        const { name: productAttribute } = <HTMLButtonElement>event.target;

        // Convert imageUrl to blob.
        if (!this.imageUrl) return;

        const image = await fetch(this.imageUrl).then(r => r.blob());
        const formData = new FormData();
        formData.append('image', image);

        const response = await fetch('http://localhost:8000/api/vision', {
            method: 'POST',
            body: formData
        });

        const responseObject = await response.json();

        this.product[productAttribute as keyof Product] = responseObject.text;
        this.updateProduct.emit(this.product);
    }

}
