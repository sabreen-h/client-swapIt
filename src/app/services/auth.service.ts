import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EditModel } from '../models/edit-model';
import { ForgotModel } from '../models/ForgotModel';
import { ResetModel } from '../models/resetpass-model';
import { Users } from '../models/users.model';
import { CryptService } from './crypt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  email: string;
  expire: string;
  role: string;
  headers = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    }),
    withCredentials: true
  };
  constructor(
    private http: HttpClient,
    private crypt: CryptService
  ) { 
    if(this.isUserIn()){
      this.email = this.crypt.Decrypt(localStorage.getItem('email'));
      this.expire = this.crypt.Decrypt(localStorage.getItem('expire'));
      this.role = this.crypt.Decrypt(localStorage.getItem('role'));
    }
  }

  GetRoleName(email:string){
    return this.http.get('https://localhost:44329/Accounts/GetRoleName/' + email, {responseType: 'text'}).pipe();
  }

  GetProfile(email: string): Observable<Users>{
    return this.http.get<Users>('https://localhost:44329/Accounts/Profile/'+email, {withCredentials: true}).pipe()
  }
  
  EditProfile(model: FormData) {
    return this.http.post('https://localhost:44329/Accounts/EditProfile', model, {withCredentials: true}).pipe();
  }

  DeleteProfile(email: string){
      return this.http.get('https://localhost:44329/Accounts/DeleteProfile/'+email,{withCredentials: true}).pipe();
  }
  
  ResetPassword(model: ResetModel): Observable<ResetModel> {
    return this.http.post<ResetModel>('https://localhost:44329/Accounts/ResetPassword', model, this.headers).pipe();
  }

  ForgotPassword(email: string){
    return this.http.get('https://localhost:44329/Accounts/ForgotPassword/'+email,{withCredentials: true}).pipe();
  }

  ResetForgotPassword(model: ForgotModel): Observable<ForgotModel> {
    return this.http.post<ForgotModel>('https://localhost:44329/Accounts/ResetForgotPassword', model, this.headers).pipe();
  }

  public installStorage(remember: boolean, email: string){
    var day = new Date();
    if(remember){
      day.setDate(day.getDate() + 14);
    } 
    else {
      day.setMinutes(day.getMinutes() + 30);
    }
    
    localStorage.setItem('email', this.crypt.Encrypt(email));
    localStorage.setItem('expire', this.crypt.Encrypt(day.toString()));
    this.GetRoleName(email).subscribe(success => {
    localStorage.setItem('role',this.crypt.Encrypt(success.toString()));
  }, err => console.log(err));
  }

  IsExpiredDate(day: string){

    const datenow = new Date();
    const dateexpired = new Date(Date.parse(day));
    if(dateexpired<datenow){
      return true;
    }
    return false;
  }

  isUserIn(){
    const email = !!localStorage.getItem('email');
    const expire = !!localStorage.getItem('expire');
    const role = !!localStorage.getItem('role');
    if(email && role && expire){
      return true;
    }
    return false;
  }
  ValidateUser(e:string, r:string){
    return this.http.get('https://localhost:44329/Accounts/CheckUserClaim/' +e+ '&' + r, {withCredentials: true}).pipe();
  }
}
