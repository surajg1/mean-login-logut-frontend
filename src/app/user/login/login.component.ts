import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  form: FormGroup;

  constructor(private userservice : UserService) { }

  ngOnInit() {
    this.form = new FormGroup({
      email : new FormControl(null, { 
        validators : [Validators.required]
      }),
      password : new FormControl(null, { 
        validators : [Validators.required]
      }),
    });
  }

  onSubmit(){
    console.log(this.form.value);
    this.userservice.login(this.form.value);
  }
}
