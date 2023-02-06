import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './documents.component';
import { DocumentsPageRoutingModule } from './documents-routing.module';

@NgModule({
  declarations: [DocumentsComponent],
  imports: [CommonModule, DocumentsPageRoutingModule],
})
export class DocumentsPageModule {}
