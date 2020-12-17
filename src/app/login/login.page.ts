import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validation_form: FormGroup;
  errorMessage: string='';
  constructor(
    private navCtrl:NavController,
    private firebaseServ:FirebaseService,
    private formbuilder:FormBuilder,
    private toast: ToastController
  ) { }

  ngOnInit() {
    this.validation_form=this.formbuilder.group({
      email:new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9_.+-]+.[a-zA-Z0-9_.+-]+$')
      ])),
      password:new FormControl('',Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    })
  }
  validation_messages={
    'email':[
      {type:'required', message:'Email is required'},
      {type: 'pattern', message: 'Enter a valid email'}
    ],
    'password':[
      {type:'required',message:'Password is required'},
      {type:'minlength',message:'Password must be at least 5 character long'}
    ]
  };
  loginUser(value){
    this.firebaseServ.loginUser(value)
    .then(res => {
      console.log(res);
      this.errorMessage = '';
      this.toastSuccess();
      this.validation_form.reset();
      this.navCtrl.navigateForward('/home')
    }, err => {
      this.toastFail();
      console.log(err);
      this.errorMessage = err.message;
    });
  }

  goRegisterPage(){
    this.navCtrl.navigateForward('/register');
  }

  async toastSuccess() {
    const toast = await this.toast.create({
      message: 'Login successful!',
      duration: 2000
    });
    toast.present();
  }
  async toastFail() {
    const toast = await this.toast.create({
      message: 'Login failed!',
      duration: 2000
    });
    toast.present();
  }
}
