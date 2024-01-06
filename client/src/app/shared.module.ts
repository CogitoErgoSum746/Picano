import { NgModule } from '@angular/core';
import { ImageChooserComponent } from './image-chooser/image-chooser.component';

@NgModule({
  declarations: [
    ImageChooserComponent,
    // Other components...
  ],
  exports: [
    ImageChooserComponent,
    // Other exported components...
  ],
})
export class SharedModule { }
