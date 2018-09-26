import { Injectable }                        from '@angular/core';

import { FormData, Mortgagesection01, Address }       from './formData.model';
import { WorkflowService } from '../workflow/workflow.service';
import { STEPS } from '../workflow/workflow.model';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';

@Injectable()
export class FormDataService {

    private formData: FormData = new FormData();
    private ismortgagesection01FormValid: boolean = false;
    private isWorkFormValid: boolean = false;
    private isAddressFormValid: boolean = false;

    constructor(private workflowService: WorkflowService) { 
    }

    getmortgagesection01(): Mortgagesection01 {
        // Return the mortgagesection01 data
        var mortgagesection01: Mortgagesection01 = {
            firstName: this.formData.firstName,
            lastName: this.formData.lastName,
            email: this.formData.email,
            typeOfLoan: this.formData.typeOfLoan,
            homeDescription: this.formData.homeDescription,
            creditProfile: this.formData.creditProfile,
            propertyUse: this.formData.propertyUse,
            zipCode: this.formData.zipCode
        };
        return mortgagesection01;
    }

    setmortgagesection01(data: Mortgagesection01) {
        // Update the mortgagesection01 data only when the mortgagesection01 Form had been validated successfully
        this.ismortgagesection01FormValid = true;
        this.formData.firstName = data.firstName;
        this.formData.lastName = data.lastName;
        this.formData.email = data.email;
        this.formData.typeOfLoan = data.typeOfLoan;
        this.formData.homeDescription = data.homeDescription;
        this.formData.creditProfile = data.creditProfile;
        this.formData.propertyUse = data.propertyUse;
        this.formData.zipCode = data.zipCode;
        // Validate mortgagesection01 Step in Workflow
        this.workflowService.validateStep(STEPS.mortgagesection01);
    }

    getWork() : string {
        // Return the work type
        return this.formData.work;
    }
    
    setWork(data: string) {
        // Update the work type only when the Work Form had been validated successfully
        this.isWorkFormValid = true;
        this.formData.work = data;
        // Validate Work Step in Workflow
        this.workflowService.validateStep(STEPS.work);
    }

    getAddress() : Address {
        // Return the Address data
        var address: Address = {
            street: this.formData.street,
            city: this.formData.city,
            state: this.formData.state,
            zip: this.formData.zip
        };
        return address;
    }

    setAddress(data: Address) {
        // Update the Address data only when the Address Form had been validated successfully
        this.isAddressFormValid = true;
        this.formData.street = data.street;
        this.formData.city = data.city;
        this.formData.state = data.state;
        this.formData.zip = data.zip;
        // Validate Address Step in Workflow
        this.workflowService.validateStep(STEPS.address);
    }

    getFormData(): FormData {
        // Return the entire Form Data
        return this.formData;
    }

    resetFormData(): FormData {
        // Reset the workflow
        this.workflowService.resetSteps();
        // Return the form data after all this.* members had been reset
        this.formData.clear();
        this.ismortgagesection01FormValid = this.isWorkFormValid = this.isAddressFormValid = false;
        return this.formData;
    }

    isFormValid() {
        // Return true if all forms had been validated successfully; otherwise, return false
      return this.ismortgagesection01FormValid && this.isWorkFormValid && this.isAddressFormValid;
    }
}
