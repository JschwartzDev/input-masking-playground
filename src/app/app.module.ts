import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { InputMaskingDirective } from './Directives/input.directive';

@NgModule({
  declarations: [
    AppComponent,
    InputMaskingDirective
  ],
  imports: [
    NgbModule,
    BrowserModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
