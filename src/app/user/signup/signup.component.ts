import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { NgForm } from '@angular/forms';
import { User } from '../user.model';
import { UserService } from '../user.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form: FormGroup;

  constructor(private userservice : UserService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name : new FormControl(null, {
        validators : [ Validators.required, Validators.minLength(3)]
      }),
      email : new FormControl(null, { 
        validators : [Validators.required]
      }),
       address : new FormControl(null, { 
        validators : [Validators.required]
      }),
      state : new FormControl(null, { 
        validators : [Validators.required]
      }),
      number : new FormControl(null, { 
        validators : [Validators.required]
      }),
      password : new FormControl(null, { 
        validators : [Validators.required]
      }),
    });

  }

  onSubmit(){
    console.log(this.form.value);
    this.userservice.postUser(this.form.value);
  }
}
