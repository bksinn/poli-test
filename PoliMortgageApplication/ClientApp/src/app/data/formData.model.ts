export class FormData {
    firstName: string = '';
    lastName : string = '';
    email: string = '';

    typeOfLoan: string = '';
    homeDescription: string = '';
    creditProfile: string = '';
    propertyUse: string = '';
    zipCode: string = '';

    work: string = '';
    street: string = '';

    city: string = '';
    state: string = '';
    zip: string = '';

    clear() {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.work = '';
        this.street = '';
        this.city = '';
        this.state = '';
        this.zip = '';
    }
}

export class Mortgagesection01 {
    firstName: string = '';
    lastName : string = '';
    email: string = '';

    typeOfLoan: string = '';
    homeDescription: string = '';
    creditProfile: string = '';
    propertyUse: string = '';
    zipCode: string = '';
}

export class Address {
    street: string = '';
    city: string = '';
    state: string = '';
    zip: string = '';
}
