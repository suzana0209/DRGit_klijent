export interface TokenPayload {
    email: string;
    password: string;
    name?: string;
    lastName?: string;
    city?: string;
    street?: string;
    number?: string;
    birthday?: Date;
    image?: string;
    activated?: string;
    role?: string;
    passengerType?: string;
    userType?: string;
    id?:string;
    img?:any;
    
  }

  /*
    Name: string;
    LastName: string;
    Email: string;
    City: string;
    Street: string;
    Number: string;
    PassangerType: string;
    Birthday: Date;
    Password: string;
    ConfirmPassword: string;
    UserType: string
  */