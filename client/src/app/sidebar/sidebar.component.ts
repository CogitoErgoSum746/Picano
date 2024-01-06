import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { ImageUploadComponent } from '../image-upload/image-upload.component';

@NgModule({
  declarations: [
    ImageUploadComponent,
    // Other components...
  ],
  imports: [
    BrowserModule,
    SharedModule,
    // Other modules...
  ],
  bootstrap: [ImageUploadComponent],
})
export class AppModule { }
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}
