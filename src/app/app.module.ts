import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { AppComponent } from './app.component';
import { AddTagModalComponent } from './shared/add-tag-modal/add-tag-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppHelper } from './app.helper';

@NgModule({
  declarations: [AppComponent, AddTagModalComponent],
  imports: [BrowserModule, AppRoutingModule, PdfJsViewerModule, NgbModule],
  providers: [AppHelper],
  bootstrap: [AppComponent],
})
export class AppModule {}
