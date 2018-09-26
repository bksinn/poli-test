import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_ASYNC_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { EventEmitter, HostListener, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Validate phone numbers
function validatePhoneNumber(): ValidatorFn {
  return (c: AbstractControl) => {
    c.markAsPristine();
    let phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    let userInput;
    if (c.value != null || c.value != undefined) {
      userInput = c.value.trim();
    }
    let isValid = phoneNumberPattern.test(userInput);
    if (isValid) {
      return null;
    }
    else {
      if (c.value !== null && c.value.length) {
        c.markAsDirty();
      }
      return {
        validatePhone: {
          valid: false
        }
      };
    }
  }
}

@Directive({
  selector: '[validatePhone][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: PhoneNumberValidator, multi: true }
  ]
})
export class PhoneNumberValidator implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = validatePhoneNumber();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

  //Auto-format phone number
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;

  @HostListener('input', ['$event']) onInputChange($event) {
    this.value = $event.target.value.trim();
    var v = this.value.replace(/\D/g, '');
    if (v.match(/^\d{3}$/) !== null) {
      this.value = '(' + v + ') ';
    } else if (v.match(/^(\d{3})(\d{3})$/) !== null) {
      this.value += '-';
    }

    //Adds formatting onfinal input
    let m = v.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (m) this.value = '(' + m[1] + ") " + m[2] + "-" + m[3];

    this.ngModelChange.emit(this.value.trim());
  }

}

//Validate email
//pattern = "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
function validateEmail(): ValidatorFn {
  return (c: AbstractControl) => {
    // let emailPattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    let isValid = emailPattern.test(c.value);

    if (isValid) {
      return null;
    } else {
      return {
        validateEmail: {
          valid: false
        }
      };
    }
  }
}

@Directive({
  selector: '[validateEmail][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: EmailValidator, multi: true }
  ]
})
export class EmailValidator implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = validateEmail();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

}

//Validate SSN
//pattern="^(\d{3}-\d{2}-\d{4})|(\d{3}\d{2}\d{4})$" 
function validateSSN(): ValidatorFn {
  return (c: AbstractControl) => {
    let ssnPattern = /^(?!000)([0-6]\d{2}|7([0-6]\d|7[012]))([ -])?(?!00)\d\d([ -|])?(?!0000)\d{4}$/;
    let userInput;
    if (c.value !== null && c.value !== undefined) {
      userInput = c.value.trim().replace(/\W/g, '');
    }
    let isValid = ssnPattern.test(userInput);

    if (isValid) {
      return null;
    } else {
      return {
        validateSSN: {
          valid: false
        }
      };
    }
  }
}

@Directive({
  selector: '[validateSSN][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: SSNValidator, multi: true }
  ]
})
export class SSNValidator implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = validateSSN();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }


  //Auto-format SSN
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;

  @HostListener('input', ['$event']) onInputChange($event) {
    this.value = $event.target.value;
    var val = this.value.replace(/\D/g, '');
    var newVal = '';
    if (val.length > 4) {
      this.value = val;
    }
    if ((val.length > 3) && (val.length < 6)) {
      newVal += val.substr(0, 3) + '-';
      val = val.substr(3);
    }
    if (val.length > 5) {
      newVal += val.substr(0, 3) + '-';
      newVal += val.substr(3, 2) + '-';
      val = val.substr(5);
    }
    newVal += val;
    this.value = newVal.substring(0, 11).trim();

    this.ngModelChange.emit(this.value);
  }

}

//Validate Date of Birth (over 18)
function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age > 18;
}

function validateAge(): ValidatorFn {
  return (c: AbstractControl) => {
    //Validate proper format first MM/DD/YYYY
    // const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    const datePattern = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    let userInput;
    if (c.value != null || c.value != undefined) {
      userInput = c.value.trim().replace(/^\/|\/$/g, '');
    }
    datePattern.test(userInput);

    const today = new Date();
    const birthDate = new Date(userInput);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    let isValid = age >= 18 && age <= 110;
    if (isValid && datePattern.test(userInput)) {
      return null;
    } else {
      return {
        validateDOB: {
          valid: false
        }
      };
    }
  }
}

@Directive({
  selector: '[validateDOB][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: DOBValidator, multi: true }
  ]
})
export class DOBValidator implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = validateAge();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;

  //Auto-format DOB
  @HostListener('input', ['$event']) onInputChange($event) {
    this.value = $event.target.value.trim();
    var v = this.value;
    if (v.match(/^\d{2}$/) !== null) {
      this.value = v + '/';
    } else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
      this.value = v + '/';
    }

    this.ngModelChange.emit(this.value.trim());
  }

}

@Directive({
  selector: '[validateZip][ngModel]',
  providers: [
    { provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => ZipCodeValidator), multi: true }
  ]
})
export class ZipCodeValidator implements Validator {
  //validator: ValidatorFn;
  constructor(private http: HttpClient) {
    //this.validator = validateZip();        
  }

  validate(c: AbstractControl) {
    let userInputZipCode = c.value.trim().replace(/\D/g, '');
    let zipCodeRegex = /(^\d{5}$)|(^\d{5}-\d{4}$)/;

    return new Promise(resolve => {
      setTimeout(() => {
        if (c.value != null && c.value.length > 4 && Number(c.value)) {
          //if Promise times out, this will get triggered after 2.5 seconds
          let promiseTimedOut = setTimeout(() => {
            console.log('2.5 seconds triggered');
            if (zipCodeRegex.test(userInputZipCode)) {
              return resolve(null);
            }
            else {
              return resolve({
                validateZip: {
                  valid: false
                }
              });
            }
          }, 2500)
          //end function for promise timeout
          console.log(userInputZipCode);
          this.http.get('https://www.pingyo.com/validate/locales/zipcode/' + userInputZipCode).subscribe(
            res => {
              if (res) {
                return resolve(null);
              }
              else if (zipCodeRegex.test(userInputZipCode)) {
                return resolve(null);
              }
              else {
                return resolve({
                  validateZip: {
                    valid: false
                  }
                })
              }
            },
            msg => {
              //console.error(`Error: ${msg.status} ${msg.statusText}`)
              if (zipCodeRegex.test(userInputZipCode)) {
                return resolve(null);
              }
              else {
                return resolve({
                  validateZip: {
                    valid: false
                  }
                });
              }
            }
          )
        }
        else {
          return resolve({
            validateZip: {
              valid: false
            }
          })
        }
      })
    })
  }

  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;

  @HostListener('input', ['$event']) onInputChange($event) {
    this.value = $event.target.value.replace(/\D/g, '').trim();
    this.ngModelChange.emit(this.value);
  }
}

// Validate ABA/Routing number
function validateABA(): ValidatorFn {
  return (c: AbstractControl) => {
    let userInput = String(c.value);

    let i, n, t, s;

    // First, remove any non-numeric characters.
    //s = userInput.replace(/\D/g, ''); ==>Alternative option to for loop
    t = "";
    for (i = 0; i < userInput.length; i++) {
      s = parseInt(userInput.charAt(i), 10);
      if (s >= 0 && s <= 9)
        t = t + s;
    }

    // Check the length, it should be nine digits (or eight for certain banks, i.e. Bank of America).

    if (t.length !== 9) {
      return {
        validateABA: {
          valid: false
        }
      }
    }

    // Now run through each digit and calculate the total.
    n = 0;
    for (i = 0; i < t.length; i += 3) {
      n += parseInt(t.charAt(i), 10) * 3
        + parseInt(t.charAt(i + 1), 10) * 7
        + parseInt(t.charAt(i + 2), 10);
    }

    //If the resulting sum is an even multiple of ten (but not zero),
    //the aba routing number is good.

    if (n != 0 && n % 10 == 0)
      return null;
    else {
      return {
        validateABA: {
          valid: false
        }
      }
    }
  }
}

@Directive({
  selector: '[validateABA][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: ABARoutingValidator, multi: true }
  ]
})

export class ABARoutingValidator implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = validateABA();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

}

// Validate ABA/Routing number
function validateSortCode(): ValidatorFn {
  return (c: AbstractControl) => {
    let sortCodePattern = /(?!0{2}(-?0{2}){2})(\d{2}(-\d{2}){2})|(\d{6})/;
    let isValid = sortCodePattern.test(c.value);

    if (isValid)
      return null;
    else {
      return {
        validateSortCode: {
          valid: false
        }
      }
    }
  }
}

@Directive({
  selector: '[validateSortCode][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: SortCodeValidator, multi: true }
  ]
})

export class SortCodeValidator implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = validateSortCode();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

}

//Force uppercase

@Directive({
  selector: '[ngModel][uppercase]'
})
export class UppercaseDirective {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;

  @HostListener('input', ['$event']) onInputChange($event) {
    this.value = $event.target.value.toLowerCase().replace(/([^a-z]|^)([a-z])(?=[a-z]{0})/g, function (_, g1, g2) {
      return g1 + g2.toUpperCase();
    });
    this.ngModelChange.emit(this.value);
  }
}

function validateState(): ValidatorFn {
  return (c: AbstractControl) => {
    const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
      'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
      'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
      'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
      'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
      'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
      'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
      'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    const stateAbbrev = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];
    //let isValid = emailPattern.test(c.value);
    let isValid = states.find((element) => c.value == element) || stateAbbrev.find((element) => c.value == element || c.value == element.toLowerCase());
    if (isValid) {
      return null;
    } else {
      return {
        validateState: {
          valid: false
        }
      };
    }
  }
}

@Directive({
  selector: '[validateState][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: StateValidator, multi: true }
  ]
})
export class StateValidator implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = validateState();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

}

function validateMonthyAmount(): ValidatorFn {
  return (c: AbstractControl) => {
    let isValid = c.value >= 500

    if (isValid) {
      return null;
    } else {
      return {
        validateMonthyAmount: {
          valid: false
        }
      };
    }
  }
}

@Directive({
  selector: '[validateMonthlyAmount][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MonthlyAmountValidator, multi: true }
  ]
})
export class MonthlyAmountValidator implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = validateMonthyAmount();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

}

function noNumbers(): ValidatorFn {
  return (c: AbstractControl) => {
    let namePattern = /^([^0-9]*)$/;
    let isValid = namePattern.test(c.value);

    if (isValid) {
      return null;
    } else {
      return {
        validateNoNumbers: {
          valid: false
        }
      };
    }
  }
}

@Directive({
  selector: '[validateNoNumbers][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: NoNumbersValidator, multi: true }
  ]
})
export class NoNumbersValidator implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = noNumbers();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

}

function validateLastName(): ValidatorFn {
  return (c: AbstractControl) => {
    let firstName: HTMLElement = document.getElementById('firstname');
    let firstNameElement: HTMLInputElement = firstName as HTMLInputElement;
    let isValid = c.value != firstNameElement.value;

    if (isValid) {
      return null;
    } else {
      return {
        validateLastName: {
          valid: false
        }
      };
    }
  }
}

@Directive({
  selector: '[validateLastName][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: LastNameValidator, multi: true }
  ]
})
export class LastNameValidator implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = validateLastName();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

}

function validateFirstName(): ValidatorFn {
  return (c: AbstractControl) => {
    let lastName: HTMLElement = document.getElementById('lastname');
    let lastNameElement: HTMLInputElement = lastName as HTMLInputElement;
    //console.log(c.value != lastNameElement.value);
    let isValid = c.value != lastNameElement.value;

    if (isValid) {
      return null;
    } else {
      return {
        validateFirstName: {
          valid: false
        }
      };
    }
  }
}

@Directive({
  selector: '[validateFirstName][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: FirstNameValidator, multi: true }
  ]
})
export class FirstNameValidator implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = validateFirstName();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

}

function validateUKPostalCode(): ValidatorFn {
  return (c: AbstractControl) => {
    let postalCodePattern = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) [0-9][A-Za-z]{2})$/i;
    let userInputPostCode
    if (c.value != null && c.value !== undefined) {
      userInputPostCode = c.value.trim();
    }

    let isValid = postalCodePattern.test(userInputPostCode);

    if (isValid) {
      return null;
    } else {
      return {
        validateUKPostalCode: {
          valid: false
        }
      };
    }
  }
}

@Directive({
  selector: '[validateUKPostalCode][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: UKPostCodeValidator, multi: true }
  ]
})
export class UKPostCodeValidator implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = validateUKPostalCode();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

  //Auto-format Post Code
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;

  @HostListener('input', ['$event']) onInputChange($event) {
    this.value = $event.target.value;
    var list = [this.value.replace(/-/g, "")];
    var newVal = '';
    if (this.value.length > 4) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)\s*(\d[A-Z]{2})$/i)) {
          this.value = list[i].match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)\s*(\d[A-Z]{2})$/i);
          this.value.shift();
          //console.log(this.value.join(' '));
          this.value = this.value.join(' ').toUpperCase();
        }
      }
    }
    this.ngModelChange.emit(this.value.trim());
  }

}

function validateUKMobileNumber(): ValidatorFn {
  return (c: AbstractControl) => {
    let mobileNumberPattern = /^(\(?(0|\+44)[7]{1}\d{1,4}?\)?\s?\d{3,4}\s?\d{3,4})$/;
    let userInputMobileNumber;
    if (c.value !== null && c.value !== undefined) {
      userInputMobileNumber = c.value.trim().replace(/\D/g, '');
    }
    console.log(userInputMobileNumber);
    let isValid = mobileNumberPattern.test(userInputMobileNumber);

    if (isValid) {
      return null;
    } else {
      return {
        validateUKMobileNumber: {
          valid: false
        }
      };
    }
  }
}

@Directive({
  selector: '[validateUKMobileNumber][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: UKMobileNumberValidator, multi: true }
  ]
})
export class UKMobileNumberValidator implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = validateUKMobileNumber();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;

  @HostListener('input', ['$event']) onInputChange($event) {
    this.value = $event.target.value.trim().replace(/\D/g, '');
    this.ngModelChange.emit(this.value);
  }
}

function validateUKHomeNumber(): ValidatorFn {
  return (c: AbstractControl) => {
    let homeNumberPattern = /^(\(?(0|\+44)[1,2,3,7,8]{1}\d{1,4}?\)?\s?\d{3,4}\s?\d{3,4})$/;
    let userInputHomeNumber;
    if (c.value !== null && c.value !== undefined) {
      userInputHomeNumber = c.value.trim().replace(/\D/g, '');
    }
    console.log(userInputHomeNumber);
    let isValid = homeNumberPattern.test(userInputHomeNumber);

    if (isValid) {
      return null;
    } else {
      return {
        validateUKHomeNumber: {
          valid: false
        }
      };
    }
  }
}

@Directive({
  selector: '[validateUKHomeNumber][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: UKHomeNumberValidator, multi: true }
  ]
})
export class UKHomeNumberValidator implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = validateUKHomeNumber();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;

  @HostListener('input', ['$event']) onInputChange($event) {
    this.value = $event.target.value.trim().replace(/\D/g, '');
    this.ngModelChange.emit(this.value);
  }

}

function driverLicenseValidator(): ValidatorFn {
  return (c: AbstractControl) => {
    //let driverLicensePattern: RegExp;
    //let driverLicensePattern = /^[A-Z]{1}[0-9]{7}$/ || /(^[0-9]{9}$)|(^[A-Z]{1}[0-9]{3,6}$)|(^[A-Z]{2}[0-9]{2,5}$)/ || /^[0-9]{9}$/ || /^[0-9]{1,7}$/ || /(^[0-9]{7}$)|(^[0-9]{9}$)/ || /^[A-Z]{1}[0-9]{12}$/ || /^[0-9]{7,9}$/ || /^[A-Z]{1}[0-9]{14}$/ || /(^[A-Z]{1}[0-9]{8}$)|(^[0-9]{9}$)/ || /(^[A-Z]{2}[0-9]{6}[A-Z]{1}$)|(^[0-9]{9}$)/ || /^[A-Z]{1}[0-9]{11,12}$/ || /(^[A-Z]{1}[0-9]{9}$)|(^[0-9]{9,10}$)/ || /^([0-9]{9}|([0-9]{3}[A-Z]{2}[0-9]{4}))$/ || /(^([A-Z]{1}[0-9]{1}){2}[A-Z]{1}$)|(^[A-Z]{1}[0-9]{8}$)|(^[0-9]{9}$)/ || /(^[A_Z]{1}[0-9]{8,9}$)|(^[0-9]{9}$)/ || /^[0-9]{1,9}$/ || /(^[0-9]{7,8}$)|(^[0-9]{7}[A-Z]{1}$)/ || /^[A-Z]{1}[0-9]{12}$/ || /(^[A-Z]{1}[0-9]{8}$)|(^[0-9]{9}$)/ || /(^[A-Z]{1}[0-9]{10}$)|(^[A-Z]{1}[0-9]{12}$)/ || /^[A-Z]{1}[0-9]{12}$/ || /^[0-9]{9}$/ || /(^[A-Z]{1}[0-9]{5,9}$)|(^[A-Z]{1}[0-9]{6}[R]{1}$)|(^[0-9]{8}[A-Z]{2}$)|(^[0-9]{9}[A-Z]{1}$)|(^[0-9]{9}$)/ || /(^[A-Z]{1}[0-9]{8}$)|(^[0-9]{13}$)|(^[0-9]{9}$)|(^[0-9]{14}$)/ || /^[0-9]{1,7}$/ || /(^[0-9]{9,10}$)|(^[0-9]{12}$)|(^[X]{1}[0-9]{8}$)/ || /^[0-9]{2}[A-Z]{3}[0-9]{5}$/ || /^[A-Z]{1}[0-9]{14}$/ || /^[0-9]{8,9}$/ || /(^[A-Z]{1}[0-9]{7}$)|(^[A-Z]{1}[0-9]{18}$)|(^[0-9]{8}$)|(^[0-9]{9}$)|(^[0-9]{16}$)|(^[A-Z]{8}$)/ || /^[0-9]{1,12}$/ || /(^[A-Z]{3}[0-9]{6}$)|(^[0-9]{9}$)/ || /(^[A-Z]{1}[0-9]{4,8}$)|(^[A-Z]{2}[0-9]{3,7}$)|(^[0-9]{8}$)/ || /(^[A-Z]{1}[0-9]{9}$)|(^[0-9]{9}$)/ || /^[0-9]{1,9}$/ || /^[0-9]{8}$/ || /(^[0-9]{9}$)|(^[0-9]{5,7}$)/ || /^([0-9]{7}$)|(^[A-Z]{1}[0-9]{6}$)/ || /^[0-9]{5,11}$/ || /(^[0-9]{6,10}$)|(^[0-9]{12}$)/ || /^[0-9]{7,9}$/ || /^[0-9]{7,8}$/ || /^[0-9]{4,10}$/ || /(^[0-9]{8}$)|(^[0-9]{7}[A]$)/ || /(^[A-Z]{1}[0-9]{8,11}$)|(^[0-9]{9}$)/ || /^(?=.{12}$)[A-Z]{1,7}[A-Z0-9\\*]{4,11}$/ || /(^[0-9]{7}$)|(^[A-Z]{1,2}[0-9]{5,6}$)/ || /^[A-Z]{1}[0-9]{13}$/ || /^[0-9]{9,10}$/;
    let licenseObject = {
      "AL": {
        "rule": "^[0-9]{1,7}$",
        "description": [
          "1-7 Numeric"
        ]
      },
      "AK": {
        "rule": "^[0-9]{1,7}$",
        "description": [
          "1-7 Numbers"
        ]
      },
      "AZ": {
        "rule": "(^[A-Z]{1}[0-9]{1,8}$)|(^[A-Z]{2}[0-9]{2,5}$)|(^[0-9]{9}$)",
        "description": [
          "1 Alpha + 1-8 Numeric",
          "2 Alpha + 2-5 Numeric",
          "9 Numeric"
        ]
      },
      "AR": {
        "rule": "^[0-9]{4,9}$",
        "description": [
          "4-9 Numeric"
        ]
      },
      "CA": {
        "rule": "^[A-Z]{1}[0-9]{7}$",
        "description": [
          "1 Alpha + 7 Numeric"
        ]
      },
      "CO": {
        "rule": "(^[0-9]{9}$)|(^[A-Z]{1}[0-9]{3,6}$)|(^[A-Z]{2}[0-9]{2,5}$)",
        "description": [
          "9 Numeric",
          "1 Alpha + 3-6 Numeric",
          "2 Alpha + 2-5 Numeric"
        ]
      },
      "CT": {
        "rule": "^[0-9]{9}$",
        "description": [
          "9 Numeric"
        ]
      },
      "DE": {
        "rule": "^[0-9]{1,7}$",
        "description": [
          "1-7 Numeric"
        ]
      },
      "DC": {
        "rule": "(^[0-9]{7}$)|(^[0-9]{9}$)",
        "description": [
          "7 Numeric",
          "9 Numeric"
        ]
      },
      "FL": {
        "rule": "^[A-Z]{1}[0-9]{12}$",
        "description": [
          "1 Alpha + 12 Numeric"
        ]
      },
      "GA": {
        "rule": "^[0-9]{7,9}$",
        "description": [
          "7-9 Numeric"
        ]
      },
      "GU": {
        "rule": "^[A-Z]{1}[0-9]{14}$",
        "description": [
          "1 Alpha + 14 Numeric"
        ]
      },
      "HI": {
        "rule": "(^[A-Z]{1}[0-9]{8}$)|(^[0-9]{9}$)",
        "description": [
          "1 Alpha + 8 Numeric",
          "9 Numeric"
        ]
      },
      "ID": {
        "rule": "(^[A-Z]{2}[0-9]{6}[A-Z]{1}$)|(^[0-9]{9}$)",
        "description": [
          "2 Alpha + 6 Numeric + 1 Alpha",
          "9 Numeric"
        ]
      },
      "IL": {
        "rule": "^[A-Z]{1}[0-9]{11,12}$",
        "description": [
          "1 Alpha + 11-12 Numeric"
        ]
      },
      "IN": {
        "rule": "(^[A-Z]{1}[0-9]{9}$)|(^[0-9]{9,10}$)",
        "description": [
          "1 Alpha + 9 Numeric",
          "9-10 Numeric"
        ]
      },
      "IA": {
        "rule": "^([0-9]{9}|([0-9]{3}[A-Z]{2}[0-9]{4}))$",
        "description": [
          "9 Numeric",
          "3 Numeric + 2 Alpha + 4 Numeric"
        ]
      },
      "KS": {
        "rule": "(^([A-Z]{1}[0-9]{1}){2}[A-Z]{1}$)|(^[A-Z]{1}[0-9]{8}$)|(^[0-9]{9}$)",
        "description": [
          "1 Alpha + 1 Numeric + 1 Alpha + 1 Numeric + 1 Alpha",
          "1 Alpha + 8 Numeric",
          "9 Numeric"
        ]
      },
      "KY": {
        "rule": "(^[A_Z]{1}[0-9]{8,9}$)|(^[0-9]{9}$)",
        "description": [
          "1 Alpha + 8-9 Numeric",
          "9 Numeric"
        ]
      },
      "LA": {
        "rule": "^[0-9]{1,9}$",
        "description": [
          "1-9 Numeric"
        ]
      },
      "ME": {
        "rule": "(^[0-9]{7,8}$)|(^[0-9]{7}[A-Z]{1}$)",
        "description": [
          "7-8 Numeric",
          "7 Numeric + 1 Alpha"
        ]
      },
      "MD": {
        "rule": "^[A-Z]{1}[0-9]{12}$",
        "description": [
          "1Alpha+12Numeric"
        ]
      },
      "MA": {
        "rule": "(^[A-Z]{1}[0-9]{8}$)|(^[0-9]{9}$)",
        "description": [
          "1 Alpha + 8 Numeric",
          "9 Numeric"
        ]
      },
      "MI": {
        "rule": "(^[A-Z]{1}[0-9]{10}$)|(^[A-Z]{1}[0-9]{12}$)",
        "description": [
          "1 Alpha + 10 Numeric",
          "1 Alpha + 12 Numeric"
        ]
      },
      "MN": {
        "rule": "^[A-Z]{1}[0-9]{12}$",
        "description": [
          "1 Alpha + 12 Numeric"
        ]
      },
      "MS": {
        "rule": "^[0-9]{9}$",
        "description": [
          "9 Numeric"
        ]
      },
      "MO": {
        "rule": "(^[A-Z]{1}[0-9]{5,9}$)|(^[A-Z]{1}[0-9]{6}[R]{1}$)|(^[0-9]{8}[A-Z]{2}$)|(^[0-9]{9}[A-Z]{1}$)|(^[0-9]{9}$)",
        "description": [
          "1 Alpha + 5-9 Numeric",
          "1 Alpha + 6 Numeric + 'R'",
          "8 Numeric + 2 Alpha",
          "9 Numeric + 1 Alpha",
          "9 Numeric"
        ]
      },
      "MT": {
        "rule": "(^[A-Z]{1}[0-9]{8}$)|(^[0-9]{13}$)|(^[0-9]{9}$)|(^[0-9]{14}$)",
        "description": [
          "1 Alpha + 8 Numeric",
          "13 Numeric",
          "9 Numeric",
          "14 Numeric"
        ]
      },
      "NE": {
        "rule": "^[0-9]{1,7}$",
        "description": [
          "1-7 Numeric"
        ]
      },
      "NV": {
        "rule": "(^[0-9]{9,10}$)|(^[0-9]{12}$)|(^[X]{1}[0-9]{8}$)",
        "description": [
          "9 Numeric",
          "10 Numeric",
          "12 Numeric",
          "'X' + 8 Numeric"
        ]
      },
      "NH": {
        "rule": "^[0-9]{2}[A-Z]{3}[0-9]{5}$",
        "description": [
          "2 Numeric + 3 Alpha + 5 Numeric"
        ]
      },
      "NJ": {
        "rule": "^[A-Z]{1}[0-9]{14}$",
        "description": [
          "1 Alpha + 14 Numeric"
        ]
      },
      "NM": {
        "rule": "^[0-9]{8,9}$",
        "description": [
          "8 Numeric",
          "9 Numeric"
        ]
      },
      "NY": {
        "rule": "(^[A-Z]{1}[0-9]{7}$)|(^[A-Z]{1}[0-9]{18}$)|(^[0-9]{8}$)|(^[0-9]{9}$)|(^[0-9]{16}$)|(^[A-Z]{8}$)",
        "description": [
          "1 Alpha + 7 Numeric",
          "1 Alpha + 18 Numeric",
          "8 Numeric",
          "9 Numeric",
          "16 Numeric",
          "8 Alpha"
        ]
      },
      "NC": {
        "rule": "^[0-9]{1,12}$",
        "description": [
          "1-12 Numeric"
        ]
      },
      "ND": {
        "rule": "(^[A-Z]{3}[0-9]{6}$)|(^[0-9]{9}$)",
        "description": [
          "3 Alpha + 6 Numeric",
          "9 Numeric"
        ]
      },
      "OH": {
        "rule": "(^[A-Z]{1}[0-9]{4,8}$)|(^[A-Z]{2}[0-9]{3,7}$)|(^[0-9]{8}$)",
        "description": [
          "1 Alpha + 4-8 Numeric",
          "2 Alpha + 3-7 Numeric",
          "8 Numeric"
        ]
      },
      "OK": {
        "rule": "(^[A-Z]{1}[0-9]{9}$)|(^[0-9]{9}$)",
        "description": [
          "1 Alpha + 9 Numeric",
          "9 Numeric"
        ]
      },
      "OR": {
        "rule": "^[0-9]{1,9}$",
        "description": [
          "1-9 Numeric"
        ]
      },
      "PA": {
        "rule": "^[0-9]{8}$",
        "description": [
          "8 Numeric"
        ]
      },
      "PR": {
        "rule": "(^[0-9]{9}$)|(^[0-9]{5,7}$)",
        "description": [
          "5-7 Numeric",
          "9 Numeric"
        ]
      },
      "RI": {
        "rule": "^([0-9]{7}$)|(^[A-Z]{1}[0-9]{6}$)",
        "description": [
          "7 Numeric",
          "1 Alpha + 6 Numeric"
        ]
      },
      "SC": {
        "rule": "^[0-9]{5,11}$",
        "description": [
          "5-11 Numeric"
        ]
      },
      "SD": {
        "rule": "(^[0-9]{6,10}$)|(^[0-9]{12}$)",
        "description": [
          "6-10 Numeric",
          "12 Numeric"
        ]
      },
      "TN": {
        "rule": "^[0-9]{7,9}$",
        "description": [
          "7-9 Numeric"
        ]
      },
      "TX": {
        "rule": "^[0-9]{7,8}$",
        "description": [
          "7-8 Numeric"
        ]
      },
      "UT": {
        "rule": "^[0-9]{4,10}$",
        "description": [
          "4-10 Numeric"
        ]
      },
      "VT": {
        "rule": "(^[0-9]{8}$)|(^[0-9]{7}[A]$)",
        "description": [
          "8 Numeric",
          "7 Numeric + 'A'"
        ]
      },
      "VA": {
        "rule": "(^[A-Z]{1}[0-9]{8,11}$)|(^[0-9]{9}$)",
        "description": [
          "1 Alpha + 8 Numeric",
          "1 Alpha + 9 Numeric",
          "1 Alpha + 10 Numeric",
          "1 Alpha + 11 Numeric",
          "9 Numeric"
        ]
      },
      "WA": {
        "rule": "^(?=.{12}$)[A-Z]{1,7}[A-Z0-9\\*]{4,11}$",
        "description": [
          "1-7 Alpha + any combination of Alpha, Numeric, and * for a total of 12 characters"
        ]
      },
      "WV": {
        "rule": "(^[0-9]{7}$)|(^[A-Z]{1,2}[0-9]{5,6}$)",
        "description": [
          "7 Numeric",
          "1-2 Alpha + 5-6 Numeric"
        ]
      },
      "WI": {
        "rule": "^[A-Z]{1}[0-9]{13}$",
        "description": [
          "1 Alpha + 13 Numeric"
        ]
      },
      "WY": {
        "rule": "^[0-9]{9,10}$",
        "description": [
          "9-10 Numeric"
        ]
      }
    };

    //Above JSON taken from: https://raw.githubusercontent.com/adambullmer/USDLRegex/master/regex.json
    let hasNumberPattern = /\d/;
    let isValid;
    let userInput;
    if (c.value !== null && c.value !== undefined) {
      userInput = c.value.replace(/\W/g, '').trim();
    }
    for (var key in licenseObject) {
      if (licenseObject.hasOwnProperty(key)) {
        //console.log(key + " -> " + licenseObject[key].rule);
        let licensePattern = new RegExp(licenseObject[key].rule);
        isValid = licensePattern.test(userInput) && hasNumberPattern.test(userInput);
        if (isValid) {
          return;
        }
      }
    }

    if (isValid) {
      return null;
    } else {
      return {
        driverLicenseValidator: {
          valid: false
        }
      };
    }
  }
}

@Directive({
  selector: '[driverLicenseValidator][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: DriverLicenseValidator, multi: true }
  ]
})
export class DriverLicenseValidator implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = driverLicenseValidator();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;

  @HostListener('input', ['$event']) onInputChange($event) {
    this.value = $event.target.value.replace(/\W/g, '').toUpperCase().trim();
    this.ngModelChange.emit(this.value);
  }

}

function validateUSAddress(): ValidatorFn {
  return (c: AbstractControl) => {
    // let usAddressPattern = /^\d+\s[A-z]+\s[A-z]+/;
    let usAddressPattern = /\b\d{1,}[a-zA-Z]{3,}\b/;
    let usAddressPattern2 = /\b[a-zA-Z]{3,}\d{1,}\b/;
    let userInput;
    if (c.value != null || c.value != undefined) {
      userInput = c.value.trim();
    }
    let isValid = usAddressPattern.test(userInput) == false &&
      usAddressPattern2.test(userInput) == false;

    if (isValid) {
      return null;
    } else {
      return {
        validateUSAddress: {
          valid: false
        }
      };
    }
  }
}

@Directive({
  selector: '[validateUSAddress][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: USAddressValidator, multi: true }
  ]
})
export class USAddressValidator implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = validateUSAddress();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }


  //Auto-format Address
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;

  @HostListener('input', ['$event']) onInputChange($event) {
    this.value = $event.target.value.trim();
    this.ngModelChange.emit(this.value);
  }

}
