export class RegistrationModel{
    Name: string;
    LastName: string;
    Email: string;
    City: string;
    Street: string;
    Number: string;
    PassangerType: string;
    //Birthday: Date;
    Birthaday:Date;
    Password: string;
    ConfirmPassword: string;
    UserType: string
    Activated: string

    constructor(name:string, lastName:string, email:string, city:string, street:string, number:string, 
        passangerType:string, birthday:Date, password:string, 
        confirmPassword:string, userType:string, activated:string){

        this.Name = name;
        this.LastName = lastName;
        this.Email = email;
        this.City = city;
        this.Street = street;
        this.Number = number;
        this.PassangerType = passangerType;
        this.Birthaday = birthday;
        this.Password = password;
        this.ConfirmPassword = confirmPassword;
        this.UserType = userType;
        this.Activated = activated;
    }
}