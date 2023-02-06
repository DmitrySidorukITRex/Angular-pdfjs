import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./document-viewer/feature/document-viewer.module').then(
        (m) => m.DocumentViewerPageModule
      ),
  },
  {
    path: 'documents',
    loadChildren: () =>
      import('./documents/feature/documents.module').then(
        (m) => m.DocumentsPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
