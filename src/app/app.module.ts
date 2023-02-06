import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddTagModalComponent } from './shared/add-tag-modal/add-tag-modal.component';

@NgModule({
  declarations: [AppComponent, AddTagModalComponent],
  imports: [BrowserModule, AppRoutingModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
