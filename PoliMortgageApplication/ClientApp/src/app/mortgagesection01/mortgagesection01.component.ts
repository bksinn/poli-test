import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Mortgagesection01 } from '../data/formData.model';
import { FormDataService } from '../data/formData.service';

@Component({
  selector: 'mt-wizard-mortgagesection01'
  , templateUrl: './mortgagesection01.component.html'
})

export class MortgageSection01 implements OnInit {
    title = 'Sample Title';
    mortgagesection01: Mortgagesection01;
    form: any;
    apiRoot: string = "https://www.pingyo.com/find/locales/zipcode/";
    response: Array<any> = [];
    zipCodeLoading: boolean = false;
    testString: string = 'test';

    
  constructor(
    private router: Router,
    private formDataService: FormDataService)
    {

    }

    ngOnInit() {
        this.mortgagesection01 = this.formDataService.getmortgagesection01();
        console.log('mortgagesection01 feature loaded!');

    } 

    scrollToElement($element): void {
      console.log($element);
      $element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }

    //For US
    //getZipInformation() {
    //  let url = `${this.apiRoot}`;
    //  let element: HTMLElement = document.getElementById('user-zipcode');
    //  let zipcodeElement: HTMLInputElement = element as HTMLInputElement;
    //  url = url + zipcodeElement.value;
    //  if (zipcodeElement.value.length == 5 && Number(zipcodeElement.value)) {
    //    this.zipCodeLoading = true;
    //    this.http.get(url).subscribe(
    //      res => {

    //        //Check to see if all area codes match, then auto fill ==> else, don't auto fill
    //        this.response = [];
    //        this.response.push(res);
    //        console.log(res);
    //        //this.areaCode = res[0].AreaCode;

    //        //this.response[0].forEach((obj) => {
    //        //  if (this.areaCode == obj.AreaCode) {
    //        //    this.personal.homePhone = "(" + this.areaCode + ") ";
    //        //    this.personal.workPhone = "(" + this.areaCode + ") ";
    //        //    this.personal.mobilePhone = "(" + this.areaCode + ") ";
    //        //  }
    //        //  else {
    //        //    this.personal.homePhone = ""
    //        //    this.personal.workPhone = ""
    //        //    this.personal.mobilePhone = ""
    //        //  }
    //        //})
    //        ////End Check to see if all area codes match

    //        //this.personal.city = res[0].City;
    //        //this.personal.state = res[0].StateAbbreviation;
    //        //this.personal.county = res[0].County;
    //        //this.personal.issuingState = res[0].StateAbbreviation;

    //        //this.formDataService.setUserLocation(this.personal);

    //        //this.formData.typeAheadState = [];
    //        //this.formData.typeAheadCity = [];
    //        //this.formData.typeAheadState.push(res[0].StateAbbreviation);
    //        //this.formData.typeAheadCity.push(res[0].City);
    //        this.zipCodeLoading = false;
    //      },
    //      msg => {
    //        this.zipCodeLoading = false;
    //        console.error(`Error: ${msg.status} ${msg.statusText}`)
    //      }
    //    );
    //  }
    //}

    save(form: any): boolean {
        if (!form.valid) {
            return false;
        }
            
        this.formDataService.setmortgagesection01(this.mortgagesection01);
        return true;
    }

    goToNext(form: any) {
        if (this.save(form)) {
            // Navigate to the work page
            this.router.navigate(['/work']);
        }
    }
}
