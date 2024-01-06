import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-chooser',
  templateUrl: './image-chooser.component.html',
  styleUrls: ['./image-chooser.component.css']
})
export class ImageChooserComponent {
  @Output() fileSelected = new EventEmitter<File>();

  openFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileChange(event: any): void {
    const files = event.target.files as FileList;
    if (files.length > 0) {
      this.fileSelected.emit(files[0]);
    }
  }
}
