import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentViewerComponent } from './document-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentViewerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentViewerPageRoutingModule {}
