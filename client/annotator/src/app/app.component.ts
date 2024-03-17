import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ImageCropperModule, ImageCroppedEvent, CropperPosition, Dimensions } from 'ngx-image-cropper';
import { ProductDetailsUpdator } from './product-extractor/product-extractor.component';
import { Product } from './app.services';
import { ChainSelectorComponent } from './chain-selector/chain-selector.component';
import { API } from '../config/API';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, ImageCropperModule, 
    ProductDetailsUpdator, ChainSelectorComponent, LoginComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
// AppComponent provides an interface to upload a brochure and keep track
// of all products and their data.
export class AppComponent {
    // user holds the current user details.
    // check for undefined user to display login page.
    authenticated: Boolean = Boolean(localStorage.getItem("jwt"));

    // To show confirmation message before submission.
    confirm: Boolean = false;

    setAuthenticated(status: Boolean) {
        this.authenticated = status;
    }

    helperText: string = '';
    brochureURLs: string[] | undefined;
    currentBrochureIndex: number = 0;

    cropper: CropperPosition = { x1: 10, y1: 10, x2: 100, y2: 100 };
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
        
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            this.authenticated = false;
            return;
        }

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
                body: formData,
                headers: {
                    "authtoken": jwt
                }
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

    // set initial cropper position.
    cropperReady(image: Dimensions) {
        const side = Math.min(image.width, image.height);

        if (image.height < image.width) {
            const x1 = (image.width - side) / 2;
            const x2 = x1 + side;
            this.cropper = { x1, y1: 0, x2, y2: side };
        } else {
            const y1 = (image.height - side) / 2;
            const y2 = y1 + side;
            this.cropper = { x1: 0, y1, x2: side, y2 };
        }
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

    handleSubmit() {
        // Confirmation for submission.
        this.confirm = true;
    }

    // Submit products along with chain data.
    async submitData() {
        this.helperText = "Submitting...";
        this.confirm = false;

        // Get chain data from dropdowns form.
        const dropDownForm = <HTMLFormElement>document.getElementById('dropdowns');
        const formData = new FormData(dropDownForm);
        const dropdowns = Object.fromEntries(formData.entries())
        const payload = {
            campaign: dropdowns,
            products: this.products
        }

        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
            this.authenticated = false;
            return;
        }

        const response = await fetch(API.submit, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authtoken: jwt
            },
            body: JSON.stringify(payload)
        });

        // Redirect to login page.
        if (response.status === 401) {
            this.authenticated = false;
            return
        }
        
        if (response.status === 400) {
            this.helperText = (await response.json()).message;
            return;
        }

        // Reset application on successful submission.
        const success = (await response.json()).success || false;

        if (success) {
            location.reload()            
        }
    }

    // Sets campaign date to all products
    // if product level date is not set.
    setDefaultDate(date: {from?: Date, to?: Date}) {
        let key: keyof typeof date;
        let value: Date;

        // Check which date is updated from key.
        if (date.hasOwnProperty("from")) {
            key = 'from'
            value = date["from"]!;
        } else if (date.hasOwnProperty("to")) {
            key = 'to'
            value = date["to"]!;
        }

        // Set the date to all products with null dates.
        this.products.forEach(product => {
            if (!product[key]) {
                product[key] = value
            }
        });
    }
}
