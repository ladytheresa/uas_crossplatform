import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  validation_form: FormGroup;
  errorMessage: string='';
  successMessage:string='';
  userUID: any;

  validation_messages={
    'username': [
      {type: 'required', message:'Username is required.'}
    ],
    'birthdate': [
      {type: 'required', message:'Birthdate is required.'}
    ],
    'fullname': [
      {type: 'required', message:'Full name is required.'}
    ],
    'email':[
      {type:'required', message:'Email is required'},
      {type: 'pattern', message: 'Enter a valid email'}
    ],
    'password':[
      {type:'required',message:'Password is required'},
      {type:'minlength',message:'Password must be at least 5 character long'}
    ]
  };
  constructor(
    private navCtrl:NavController,
    private firebaseServ:FirebaseService,
    private formbuilder:FormBuilder,
    private toast: ToastController
  ) { }

  ngOnInit() {
    this.validation_form=this.formbuilder.group({
      username: new FormControl ('', Validators.compose([
        Validators.required
      ])),
      fullname: new FormControl ('', Validators.compose([
        Validators.required
      ])),
      birthdate: new FormControl ('', Validators.compose([
        Validators.required
      ])),
      email:new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9_.+-]+.[a-zA-Z0-9_.+-]+$')
      ])),
      password:new FormControl('',Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  tryRegister(value){
    this.firebaseServ.registerUser(value)
      .then(res=>{
        console.log(res);
        this.errorMessage='',
        //this.successMessage='Your account has been created. Please login';
        this.toastSuccess();
        this.firebaseServ.userDetails().subscribe(res =>{
          this.userUID = res.uid;
          this.inputDatabase(value);
          this.navCtrl.navigateForward('/home')
        });
        this.validation_form.reset();
      }, err=> {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage= '';
        this.toastFail();
      });
  }

  inputDatabase(form){
    let obj = {
      username: form.username,
      fullname:form.fullname,
      birthdate:form.birthdate,
      picture: "null",
      uid: this.userUID
    }
    this.firebaseServ.create(obj, this.userUID).then(res => {
      }).catch(error => console.log(error));
  }

  goLoginPage(){
    this.navCtrl.navigateBack('');
  }

  async toastSuccess() {
    const toast = await this.toast.create({
      message: 'Register successful!',
      duration: 2000
    });
    toast.present();
  }

  async toastFail() {
    const toast = await this.toast.create({
      message: 'Register failed!',
      duration: 2000
    });
    toast.present();
  }


}
