import { LoginDetails } from "./login.details";

export class LoginResponse 
{
    status:boolean;
    errorCode:number;
    internalMessage:string;
    data:LoginDetails[];
   
}