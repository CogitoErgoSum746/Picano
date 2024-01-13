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
    @Input() currentCrop: string | undefined ;

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

    handleClick(event: Event) {
        const button = <HTMLButtonElement>event.target;
        // API to google vision.
        this.product[button.name as keyof Product] = button.name;
        this.updateProduct.emit(this.product);
        console.log(this.product);
    }

}
