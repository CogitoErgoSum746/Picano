import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ImageCropperModule, ImageCroppedEvent } from 'ngx-image-cropper';
import { ProductDetailsUpdator } from './product-extractor/product-extractor.component';
import { Product } from './app.services';
import { ChainSelectorComponent } from './chain-selector/chain-selector.component';
import { API } from '../config/API';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ImageCropperModule, ProductDetailsUpdator, ChainSelectorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
// AppComponent provides an interface to upload a brochure and keep track
// of all products and their data.
export class AppComponent {
    helperText: string = '';
    brochureURLs: string[] | undefined;
    currentBrochureIndex: number = 0;

    // current cropped image url.
    croppedImage: string | undefined;

    // products contain product objects.
    products: Array<Product> = [];
    currentProductId: string | undefined;

    // Change Current Image displayed on 
    // Cropper.
    changeCurrentBrochure(event: Event) {
        const { value } = <HTMLSelectElement>event.target;
        this.currentBrochureIndex = Number(value);
    }

    async handleUpload(event: any) {
        const [file] = <File[]>event.target.files;

        // Check type of file.
        if (file.type.startsWith("image")) {
            const imageURL = URL.createObjectURL(file);
            this.setBrochures([imageURL]);
        } else {
            this.helperText = "Processing..."
            // PDF file should be converted to images
            // before setting to brochureImages.
            const formData = new FormData();
            formData.append('pdf', file);

            const response = await fetch(API.pdfToImages, { 
                method: "POST",
                body: formData
            });
            const { images } = await response.json();

            // convert images to imageURLs.
            const imageURLs: string[] = images.map((image: string) => {
                const prefix = 'data:image/png;base64,'
                return prefix + image;
            });
            this.helperText = '';

            this.setBrochures(imageURLs);
        }
    }

    setBrochures(urls: string[]) {
        this.brochureURLs = urls;
        this.helperText = "Add a product to get started."
    }

    // imageCropped updates the product image.
    imageCropped(event: ImageCroppedEvent) {
        if (event.objectUrl)
            this.croppedImage = event.objectUrl;
    }

    // addProduct adds a new product to products.
    addProduct(event: any) {
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
        if (this.products.some(product => product.id === productId)) {
            this.helperText = "Product already exists. Select from the drop-down."
            return;
        }

        // create new product.
        const newProduct = new Product(productId);
        this.products.push(newProduct);

        // Make new product the current working product.
        this.currentProductId = newProduct.id;

        // Clear form.
        event.target.reset();
        this.helperText = '';
    }

    changeCurrentProduct(event: any) {
        this.helperText = '';
        this.currentProductId = event.target.value;
    }

    isCurrentProduct(id: string) {
        return id === this.currentProductId;
    }

    getCurrentProduct(): Product {
        const product = this.products.find(product => product.id === this.currentProductId);
        if (!product) {
            this.helperText = "Something failed while getting current product";
            return <Product>{};
        }

        return product;
    }

    setProductDetails(newProduct: Product) {
        const index = this.products.findIndex(product => product.id === newProduct.id);
        this.products.splice(index, 1, newProduct);
    }
}
