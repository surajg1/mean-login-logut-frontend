import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })

export class UserService {

    private token: string;
    private tokenTimer: any;
    isAuthenticated = false;
    private authStatusListener = new Subject<boolean>();
    private userId: string;

    readonly baseURL = "http://localhost:3000/user";

    
    constructor(private http : HttpClient, private router: Router) { }
    
    getToken(){
          return this.token;
    }
    
     getIsAuth(){
        return this.isAuthenticated;
    }
        
    getUserId(){
        return this.userId;
    }
    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    postUser(usr : User){
        return this.http.post(this.baseURL,usr).subscribe(res =>{
            this.router.navigate(["/"]);
            console.log(res);
        }, error =>{
            this.authStatusListener.next(false);
        });
      }

    login(loginData){
        this.http.post<{token: string, expiresIn: number, userId: string}>(this.baseURL+'/login',loginData)
            .subscribe( response =>{
                console.log(response);
                const token = response.token;
                this.token = token;
                if(token){
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.authStatusListener.next(true);

                    const now= new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    console.log(expirationDate);
                    this.saveAuthData(token, expirationDate, this.userId);
                    this.router.navigate(["/"]);
                }
        }, error => {
            this.authStatusListener.next(false);
            alert("Try again!");

        })
    }

    autoAuthUser(){
        const authInformation = this.getAuthData();
        if(!authInformation){
            return; 
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

        console.log(authInformation, expiresIn);
        if(expiresIn > 0){
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    private setAuthTimer(duration: number){

        console.log("Setting timer : "+ duration);
        this.tokenTimer =  setTimeout(()=>{
            this.logout();
          },(duration * 1000));
    }

    logout(){
        this.token = null;
        this.userId = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthDate();
        this.router.navigate(["login"]);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string){
            localStorage.setItem('token', token);
            localStorage.setItem('expiration', expirationDate.toISOString());
            localStorage.setItem("userId", userId);
    }

    private clearAuthDate(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("userId");
    }

    private getAuthData(){
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        
        if(!token || !expirationDate){
            return;
        }
        return{
            token : token,
            expirationDate : new Date(expirationDate),
            userId : localStorage.getItem("userId")
        }
    }

}