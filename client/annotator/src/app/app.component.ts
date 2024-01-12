import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ImageCropperModule, ImageCroppedEvent } from 'ngx-image-cropper';
import { ProductExtractorComponent } from './product-extractor/product-extractor.component';
import { Product } from '../types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ImageCropperModule, ProductExtractorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
// AppComponent provides an interface to upload a brochure and keep track
// of all products and their data.
export class AppComponent {
    helperText: string = '';
    brochureFile: File | undefined;

    // current cropped image url.
    croppedImage: string | null | undefined = '';

    // A HashMap to store product data.
    // 
    // productID(string) => productDetails(object).
    products: Map<string, Product> = new Map();

    // handleImageUpload method injects the image into dom on upload.
    showImage(event: any) {
        const [file] = event.target.files;
        this.brochureFile = file;
    }

    // imageCropped updates the product image.
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.objectUrl;
    }

    // addProduct adds a new product to products.
    addProduct(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(<HTMLFormElement>event.target);
        const productId = formData.get('productId')?.toString();

        // Do nothing for empty id.
        if (productId === '' || productId === undefined) {
            this.helperText = "Add an Id to create a product."
            return;
        }

        // If productId already exists in products,
        // notify the user to select from the drop-down.
        if (this.products.has(productId)) {
            this.helperText = "Product already exists. Select from the drop-down."
            return;
        }

        // add to products.
        this.products.set(productId, <Product>{});
    }
}
