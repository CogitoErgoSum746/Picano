import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
    brochureURL: null | string = null;

    // handleImageUpload method injects the image into dom on upload.
    showImage(event: any) {
        const [file] = event.target.files;
        this.brochureURL = URL.createObjectURL(file);
    }
}
