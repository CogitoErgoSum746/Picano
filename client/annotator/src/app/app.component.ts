import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ImageCropperModule, ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ImageCropperModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
    brochureFile: File | undefined;

    // handleImageUpload method injects the image into dom on upload.
    showImage(event: any) {
        const [file] = event.target.files;
        this.brochureFile = file;
    }

    imageCropped(event: ImageCroppedEvent) {
        console.log("cropped");
    }
}
