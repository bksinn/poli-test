import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/* App Root */
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';

/* Feature Components */
import { MortgageSection01 } from './mortgagesection01/mortgagesection01.component';
import { WorkComponent } from './work/work.component';
import { AddressComponent } from './address/address.component';
import { ResultComponent } from './result/result.component';

/* Routing Module */
import { AppRoutingModule } from './app-routing.module';

/* Shared Service */
import { FormDataService } from './data/formData.service';
import { WorkflowService } from './workflow/workflow.service';
import {
  DriverLicenseValidator,
  PhoneNumberValidator,
  EmailValidator,
  SSNValidator,
  DOBValidator,
  ZipCodeValidator,
  ABARoutingValidator,
  UppercaseDirective,
  StateValidator,
  MonthlyAmountValidator,
  NoNumbersValidator,
  LastNameValidator,
  FirstNameValidator,
  UKPostCodeValidator,
  UKMobileNumberValidator,
  UKHomeNumberValidator,
  SortCodeValidator,
  USAddressValidator
} from './shared/custom-validations.directive';

/* Angular Material Imports */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatRadioModule,
    MatInputModule,
    AppRoutingModule
  ],
  providers: [
    { provide: FormDataService, useClass: FormDataService },
    { provide: WorkflowService, useClass: WorkflowService}
  ],
  declarations: [
    AppComponent,
    NavbarComponent,
    MortgageSection01,
    WorkComponent,
    AddressComponent,
    ResultComponent,
    DriverLicenseValidator,
    PhoneNumberValidator,
    EmailValidator,
    SSNValidator,
    DOBValidator,
    ZipCodeValidator,
    ABARoutingValidator,
    UppercaseDirective,
    StateValidator,
    NoNumbersValidator,
    LastNameValidator,
    FirstNameValidator,
    MonthlyAmountValidator,
    UKPostCodeValidator,
    UKMobileNumberValidator,
    UKHomeNumberValidator,
    SortCodeValidator,
    USAddressValidator
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
