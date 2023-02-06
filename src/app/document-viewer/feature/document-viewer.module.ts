import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentViewerComponent } from './document-viewer.component';
import { DocumentViewerPageRoutingModule } from './document-viewer-routing.module';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DocumentViewerDataService } from '../data-access/document-viewer-data.service';

@NgModule({
  declarations: [DocumentViewerComponent],
  imports: [
    CommonModule,
    DocumentViewerPageRoutingModule,
    PdfJsViewerModule,
    NgbModule,
  ],
  providers: [DocumentViewerDataService],
})
export class DocumentViewerPageModule {}
