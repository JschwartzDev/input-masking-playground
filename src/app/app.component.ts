import { Component } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'input-playground';
  unmasked: string;

  constructor() {

  }

  TestFormGroup = new FormGroup({
    ShortDate: new FormControl(),
    LongDate: new FormControl(),
    CardNumber: new FormControl(),
    CVV: new FormControl(),
    ShortZipCode: new FormControl(),
    LongZipCode: new FormControl(),
    PhoneNumber: new FormControl(),
    SocialSecurityNumber: new FormControl(),
    Password: new FormControl(),
    DollarAmount: new FormControl(),
    Email: new FormControl()
  })


  checkUnmasked(curString: string, event: Event) {
    console.log(curString)
  }


}
