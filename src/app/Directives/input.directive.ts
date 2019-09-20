import { Directive, ElementRef, OnInit, Renderer2, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appMask]'
})
export class InputMaskingDirective implements OnInit {


  constructor(private el: ElementRef, private renderer: Renderer2) { }


  ngOnInit() {
  }

  @Input() MaskType: string;
  @Output() unmasked = new EventEmitter<any>();


  @HostListener('keyup', ['$event']) onKeyUp() {

    switch (this.MaskType) {
      case "shortDate":
        this.MaskFutureShortDate(event);
        break;
      case "longDate":
        this.MaskFutureLongDate(event);
        break;
      case "phoneNumber":
        this.MaskPhoneNumber(event);
        break;
      case "ssn":
        this.MaskSSN(event);
        break;
      case "shortZipCode":
        this.MaskShortZipCode(event);
        break;
      case "longZipCode":
        this.MaskLongZipCode(event);
        break;
      case "cardNumber":
        this.MaskCardNumber(event);
        break;
      case "cvv":
        this.MaskCVV(event);
        break;
      case "dollarAmount":
        this.MaskDollarAmount(event);
        break;
    }
  }


  /*
    Use for masking dates in the format mm/yy that need to be today or greater
  */
  public MaskFutureShortDate(event) {

    //element ref
    let el = this.el.nativeElement;

    let deleting: boolean;

    if (event.key !== 'Backspace') {
      deleting = false;
    } else if (event.key === 'Backspace') {
      deleting = true;
    }

    if (!deleting) {
      //store references
      const date = new Date();
      const twoDigYear = (date.getFullYear().toString()).substring(2);
      const twoDigYearAsArr = Array.from(twoDigYear);
      const curMonth = date.getMonth() + 1;
      const curString = el.value;
      const lastEntered = curString.substring(curString.length - 1);
      //if the character is not a number then reject it
      if (!parseInt(lastEntered)) {
        //if these, do nothing.  note: 0 is not recognized as a number by parseInt
        if (lastEntered === '/' || lastEntered === '0') {
        } else {
          //reject the character here
          const deleteLast = curString.substring(0, curString.length - 1);
          this.renderer.setProperty(el, 'value', deleteLast);
        }
      }

      //reject any first number higher than 1. all months start with 1
      if (curString.length == 1 && parseInt(curString) >= 2) {
        this.renderer.setProperty(el, 'value', "");
      }

      //reject any number higher than 12 for first two digits
      if (curString.length === 2 && parseInt(curString) > 12) {
        this.renderer.setProperty(el, 'value', curString.substring(0, 1));
        //if the month passes, append a /
      } else if (curString.length === 2) {
        this.renderer.setProperty(el, 'value', curString + '/');
      }
      //if the first digit of the entered year is less than the current years first digit reject it
      if (curString.length === 4 && curString.substring(3) < twoDigYearAsArr[0]) {
        this.renderer.setProperty(el, 'value', curString.substring(0, 3));
      }
      //if full entered year is less than current year reject it
      if (curString.length === 5 && curString.substring(3) < twoDigYear) {
        this.renderer.setProperty(el, 'value', curString.substring(0, 4));
      }

      //if year is current year and month entered is less than current month: delete total entry
      if (curString.length === 5 && curString.substring(3) === twoDigYear && curString.substring(0, 2) < curMonth) {
        this.renderer.setProperty(el, 'value', "");
      }

      //reject any extra characters past the format of mm/yy
      if (curString.length > 5) {
        this.renderer.setProperty(el, 'value', curString.substring(0, 5));
      }

      //unmask and emit data
      if (curString.length > 0) {
        let splitDate = curString.split("/");
        let year = splitDate.length > 1 ? splitDate[1] : "";
        let data = {
          month: splitDate[0],
          year: year.length == 1 ? year : year.substring(0, 2)
        }

        this.unmasked.emit(data);
      }

    }



    //if deleting do nothing
    if (deleting) {

    }

  }


  /*
    Use for masking dates in format dd/mm/yyyy that must be today or greater
  */
  public MaskFutureLongDate(event) {

    //element ref
    let el = this.el.nativeElement;

    let deleting: boolean;

    if (event.key !== 'Backspace') {
      deleting = false;
    } else if (event.key === 'Backspace') {
      deleting = true;
    }

    if (!deleting) {
      //store references
      const date = new Date();
      const fullYear = date.getFullYear().toString();
      const fullYearAsArr = Array.from(fullYear);
      const twoDigYear = (date.getFullYear().toString()).substring(2);
      const twoDigYearAsArr = Array.from(twoDigYear);
      const curMonth = date.getMonth() + 1;
      const curString = el.value;
      const lastEntered = curString.substring(curString.length - 1);

      //if the character is not a number then reject it
      if (!parseInt(lastEntered)) {
        //if these, do nothing.  note: 0 is not recognized as a number by parseInt
        if (lastEntered === '/' || lastEntered === '0') {
        } else {
          //reject the character here
          const deleteLast = curString.substring(0, curString.length - 1);
          this.renderer.setProperty(el, 'value', deleteLast);
        }
      }

      //reject any first number higher than 1. all months start with 1
      if (curString.length == 1 && parseInt(curString) > 3) {
        this.renderer.setProperty(el, 'value', "");
      }

      //reject any number higher than 12 for first two digits
      if (curString.length == 2 && parseInt(curString) > 31) {
        this.renderer.setProperty(el, 'value', curString.substring(0, 1));
        //if the day passes, append a /
      } else if (curString.length == 2) {
        this.renderer.setProperty(el, 'value', curString + '/');
      }
      //if the first digit of the entered month is less than 1
      if (curString.length == 4 && parseInt(curString.substring(3)) > 1) {
        this.renderer.setProperty(el, 'value', curString.substring(0, 3));
      }
      //if full entered month is > 12 reject last entered
      if (curString.length == 5 && parseInt(curString.substring(3)) > 12) {
        this.renderer.setProperty(el, 'value', curString.substring(0, 4));
        //else if string passes then append /
      } else if (curString.length == 5) {
        this.renderer.setProperty(el, 'value', curString + "/");
      }

      //if the first digit of the entered year is less than first dig of current year reject it
      if (curString.length == 7 && parseInt(lastEntered) < parseInt(fullYearAsArr[0])) {
        this.renderer.setProperty(el, 'value', curString.substring(0, 6));
      }

      //reject any extra characters past the format of dd/mm/yyyy
      if (curString.length > 10) {
        this.renderer.setProperty(el, 'value', curString.substring(0, 10));
      }

      //unmask and emit data
      if (curString.length > 0) {
        let splitDate = curString.split("/");
        let month = splitDate.length > 1 ? splitDate[1] : "";
        let year = splitDate.length > 2 ? splitDate[2] : "";
        let data = {
          day: splitDate[0],
          month: month.length == 1 ? month : month.substring(0, 2),
          year: year.length == 1 ? year : year.substring(0, 4)
        }

        this.unmasked.emit(data);
      }

    }

    //if deleting do nothing
    if (deleting) {

    }

  }

  /*
    Use for masking phone numbers in the format (###) ###-####
  */
  public MaskPhoneNumber(event) {
    //element ref
    let el = this.el.nativeElement;

    let deleting: boolean;

    if (event.key !== 'Backspace') {
      deleting = false;
    } else if (event.key === 'Backspace') {
      deleting = true;
    }

    if (!deleting) {
      //store references
      const curString = el.value;
      const lastEntered = curString.substring(curString.length - 1);

      //if the character is not a number then reject it
      if (!parseInt(lastEntered)) {
        //if these, do nothing.  note: 0 is not recognized as a number by parseInt
        if (lastEntered === '0') {
        } else {
          //reject the character here
          const deleteLast = curString.substring(0, curString.length - 1);
          this.renderer.setProperty(el, 'value', deleteLast);
        }
      }

      if (curString.length == 3) {
        this.renderer.setProperty(el, 'value', `(${curString}) `);
      }

      if (curString.length == 9) {
        this.renderer.setProperty(el, 'value', `${curString}-`)
      }

      if (curString.length > 14) {
        this.renderer.setProperty(el, 'value', curString.substring(0, 14))
      }

      //unmask phone number and emit plain digits
      if (curString.length > 0) {
        let areaCode = curString.length >= 4 ? curString.substring(1, 4) : curString;
        //rest = "###-####"
        let rest = curString.split(" ")[1];
        //first three digits after area code
        let firstThree = rest != undefined ? rest.split("-")[0] : null;
        //Perform magic for last four digits after -
        let lastFour = rest != undefined ? rest.split("-")[1] : null;
        let four = lastFour != null ? lastFour.substring(0, 4) : lastFour;

        let data = {
          areaCode: areaCode,
          firstThree: firstThree,
          //further magic
          lastFour: lastFour != null && lastFour.length >= 4 ? four : lastFour
        }

        this.unmasked.emit(data);
      }
    }

    //if deleting, do nothing
    if (deleting) {

    }

  }

  /*
    Use for masking Social Security Numbers in format ###-##-####
  */
  public MaskSSN(event) {
    //element ref
    let el = this.el.nativeElement;

    let deleting: boolean;

    if (event.key !== 'Backspace') {
      deleting = false;
    } else if (event.key === 'Backspace') {
      deleting = true;
    }


    if (!deleting) {
      //store references
      const curString = el.value;
      const lastEntered = curString.substring(curString.length - 1);

      //if the character is not a number then reject it
      if (!parseInt(lastEntered)) {
        //if these, do nothing.  note: 0 is not recognized as a number by parseInt
        if (lastEntered === '0') {
        } else {
          //reject the character here
          const deleteLast = curString.substring(0, curString.length - 1);
          this.renderer.setProperty(el, 'value', deleteLast);
        }
      }

      //after first 3 characters insert a -
      if (curString.length == 3) {
        this.renderer.setProperty(el, 'value', `${curString}-`)
      }

      //after the 6th character insert a -
      if (curString.length == 6) {
        this.renderer.setProperty(el, 'value', `${curString}-`)
      }

      //restrict length to 11 characters
      if (curString.length > 11) {
        this.renderer.setProperty(el, 'value', curString.substring(0, 11))
      }

      //unmask phone number and emit plain digits
      if (curString.length > 0) {
        let split = curString.split("-");
        let ssn = "";
        split.forEach(x => {
          ssn += x;
        })

        let data = {
          SSN: ssn.length < 9 ? ssn : ssn.substring(0, 9)
        }

        this.unmasked.emit(data);
      }

    }

    if (deleting) {

    }
  }

  /*
    Use for masking Zip Codes in the format #####
  */
  public MaskShortZipCode(event) {
    //element ref
    let el = this.el.nativeElement;

    let deleting: boolean;

    if (event.key !== 'Backspace') {
      deleting = false;
    } else if (event.key === 'Backspace') {
      deleting = true;
    }


    if (!deleting) {
      //store references
      const curString = el.value;
      const lastEntered = curString.substring(curString.length - 1);

      //if the character is not a number then reject it
      if (!parseInt(lastEntered)) {
        //if these, do nothing.  note: 0 is not recognized as a number by parseInt
        if (lastEntered === '0') {
        } else {
          //reject the character here
          const deleteLast = curString.substring(0, curString.length - 1);
          this.renderer.setProperty(el, 'value', deleteLast);
        }
      }

      if (curString.length > 5) {
        this.renderer.setProperty(el, 'value', curString.substring(0, 5));
      }

      //unmask phone number and emit plain digits
      if (curString.length > 0) {
        let data = {
          zip: curString
        }

        this.unmasked.emit(data);
      }
    }

    //if deleting, do nothing
    if (deleting) {

    }
  }

  /*
    Use for masking Zip Codes in the format #####-####
  */
  public MaskLongZipCode(event) {
    //element ref
    let el = this.el.nativeElement;

    let deleting: boolean;

    if (event.key !== 'Backspace') {
      deleting = false;
    } else if (event.key === 'Backspace') {
      deleting = true;
    }


    if (!deleting) {
      //store references
      const curString = el.value;
      const lastEntered = curString.substring(curString.length - 1);

      //if the character is not a number then reject it
      if (!parseInt(lastEntered)) {
        //if these, do nothing.  note: 0 is not recognized as a number by parseInt
        if (lastEntered === '0') {
        } else {
          //reject the character here
          const deleteLast = curString.substring(0, curString.length - 1);
          this.renderer.setProperty(el, 'value', deleteLast);
        }
      }

      //if a 6th digit is entered, put a dash between the 5th and 6th character
      if (curString.length == 6) {
        this.renderer.setProperty(el, 'value', `${curString.substring(0, 5)}-${lastEntered}`)
      }

      //restrict input length to 10
      if (curString.length > 10) {
        this.renderer.setProperty(el, 'value', curString.substring(0, 10));
      }

      //unmask phone number and emit plain digits
      if (curString.length > 0) {
        let split = curString.split("-");

        let firstFive = split.length > 0 ? split[0] : "";
        let lastFour = split.length > 1 ? split[1] : "";

        let zip = firstFive.length > 0 && lastFour.length > 0 ? `${"" + firstFive + lastFour}` : curString;
        let data = {
          zip: zip.length <= 9 ? zip : zip.substring(0, 9)
        }

        this.unmasked.emit(data);
      }
    }

    //if deleting, do nothing
    if (deleting) {

    }
  }


  /*
    Use to mask dollar amounts in the format $###.## (can accept any number of numbers to the left of the decimal)
  */
  public MaskDollarAmount(event) {

    let el = this.el.nativeElement;

    let deleting: boolean;

    //make sure the user is not currently deleting
    if (event.key !== 'Backspace') {
      deleting = false;
    } else if (event.key === 'Backspace') {
      deleting = true;
    }


    if (!deleting) {
      const curString = el.value.toString();
      //prepend $ to the front of the value once user starts typing
      if (curString.length <= 1) {
        //control.setValue('$' + curString);
        this.renderer.setProperty(el, 'value', '$' + curString);
      }
      //store reference of the last entered character
      const lastEntered = curString.substring(curString.length - 1);
      //if the character is not a number or a . then reject it
      if (!parseInt(lastEntered)) {
        //do nothing if these note: 0 is not recognized as a number by parseInt
        if (lastEntered === '0' || lastEntered === '.') {
        } else {
          //reject the character here
          const deleteLast = curString.substring(0, curString.length - 1);
          this.renderer.setProperty(el, 'value', deleteLast);
        }
      }
      //if . exists split string into dollars and cents
      if (curString.indexOf(".") != -1) {
        let split = curString.split(".");
        let cents = split[1];
        let dollars = split[0];
        //restrict available spaces after decimal to 2
        if (split[1].length >= 2) {
          cents = split[1].substring(0, 2);
        }

        let curValue = `${dollars}.${cents}`
        this.renderer.setProperty(el, 'value', curValue);
      }

      //unmask dollar amount and emit data
      if (curString.length != 0) {
        if (curString.indexOf(".") != -1) {
          let split = curString.split(".");
          let dollars = split[0].substring(1);
          let cents = split[1].substring(0, 2);

          let data = {
            dollars: dollars,
            cents: cents
          }

          this.unmasked.emit(data);
        } else if (curString.length == 1) {
          let dollars = curString
          let data = {
            dollars: dollars
          }

          this.unmasked.emit(data);
        } else if (curString.length > 1) {
          let dollars = curString.substring(1)

          let data = {
            dollars: dollars
          }

          this.unmasked.emit(data);
        }

      }
    }

    //if deleting do nothing
    if (deleting) {

    }
  }

  /*
    Use to mask a Credit/Debit Card Number in the format #### #### #### ####
  */
  public MaskCardNumber(event) {

    let el = this.el.nativeElement;

    let deleting: boolean;
    //make sure the user is not currently deleting
    if (event.key != 'Backspace') {
      deleting = false;
    } else if (event.key == 'Backspace') {
      deleting = true;
    }

    if (!deleting) {
      const curString = el.value.toString();
      //store reference of the last entered character
      const lastEntered = curString.substring(curString.length - 1);
      //if the character is not a number then reject it
      if (!parseInt(lastEntered)) {
        //if 0 do nothing note: 0 is not recognized as a number by parseInt
        if (lastEntered == '0') {
        } else {
          //reject the character here
          const deleteLast = curString.substring(0, curString.length - 1);
          this.renderer.setProperty(el, 'value', deleteLast);
        }
      }

      //if length is 4, insert first space
      if (curString.length == 4) {
        this.renderer.setProperty(el, 'value', curString + ' ');
      }

      //if length is greater than 4 
      if (curString.length > 4) {
        //globally remove all spaces from the string and store a string with no spaces
        const noSpaces = curString.replace(/\s/g, '');
        //if the length of the string with no spaces divided by 4 has no remainder, add a space
        if (noSpaces.length % 4 == 0) {
          this.renderer.setProperty(el, 'value', curString + ' ');
        }
      }

      //unmask and emit data
      if (curString.length > 0) {
        let split = curString.split(" ");
        let num = "";

        split.forEach(x => {
          num += x;
        })
        let data = {
          number: num
        }

        this.unmasked.emit(data);
      }


    }

    //if deleting do nothing
    if (deleting) {

    }
  }



  /*
    Use to constrain an input field to allow only numbers and at most 4 numbers in length
  */
  public MaskCVV(event) {

    let el = this.el.nativeElement;

    let deleting: boolean;

    if (event.key !== 'Backspace') {
      deleting = false;
    } else if (event.key === 'Backspace') {
      deleting = true;
    }

    if (!deleting) {
      const curString = el.value.toString();
      const lastEntered = curString.substring(curString.length - 1);
      if (!parseInt(lastEntered)) {
        if (lastEntered === '0') {
        } else {
          const deleteLast = curString.substring(0, curString.length - 1);
          this.renderer.setProperty(el, 'value', deleteLast);
        }
      }

      if (curString.length >= 5) {
        let newStr = curString.substring(0, 4);
        this.renderer.setProperty(el, 'value', newStr);
      }

      //unmask and emit data
      if (curString.length > 0) {
        let data = {
          cvv: curString.length == 3 ? curString.substring(0, 3) : curString.substring(0, 4)
        }

        this.unmasked.emit(data);
      }
    }

    if (deleting) {

    }
  }

}


