import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Assuming you have a Material module for Angular Material components
import { HomeComponent } from './components/home/home.component';
import { QuoteDialogComponent } from './components/quote-dialog/quote-dialog.component';
import { ContactDialogComponent } from './components/contact-dialog/contact-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuoteDialogComponent,
    ContactDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule, // Importing the Material module
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
