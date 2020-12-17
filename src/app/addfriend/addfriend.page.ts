import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../firebase.service';
import { map } from 'rxjs/operators/';
import { NavController, ToastController } from '@ionic/angular';
import { Toast } from '@capacitor/core';

@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.page.html',
  styleUrls: ['./addfriend.page.scss'],
})
export class AddfriendPage implements OnInit {

  userlist:any;
  friend:any;
  userUID:any;
  searchterm:string;
  validation_form: FormGroup;
  errorMessage: string='';
  added:boolean=false;

  fusername:any;
  ffullname:any;
  fbirthdate:any;
  fpicture:any;

  constructor(
    private db: AngularFireDatabase,
    private firebaseServ:FirebaseService,
    private formbuilder:FormBuilder,
    private navCtrl:NavController,
    private toast:ToastController
  ) { }

  ngOnInit(){
    this.firebaseServ.userDetails().subscribe(res =>{
      if (res !== null) {
        this.userUID = res.uid;     
      } else {
        this.navCtrl.navigateBack('/login');
      }
    });
    this.validation_form=this.formbuilder.group({
      search:new FormControl('',Validators.compose([
        Validators.minLength(3),
        Validators.required
      ]))
    });

  }
  validation_messages={
    'search':[
      {type:'required', message:'Please enter a valid username'},
      {type: 'minlength', message: 'Please enter at least 3 letter'}
    ]
  }

  setFilteredItems() { 
    let searchterm = this.validation_form.get('search').value;
    console.log(searchterm);

      this.firebaseServ.getUser(searchterm).snapshotChanges().pipe(
        map(changes => changes.map(
          c => ({
            key: c.payload.key, ...c.payload.val()
          })
        ))
      ).subscribe(data => {
        this.userlist = data;
        console.log(this.userlist);
      });
  
    }

    back(){
      this.navCtrl.navigateBack('/home/tabs/friends');
    }

    addFriend(key){
      console.log(key);
      this.db.object('/profile/'+key).valueChanges().subscribe(res => {
        console.log(res);
        this.fusername=res['username'];
        this.ffullname=res['fullname'];
        this.fbirthdate=res['birthdate'];
        this.fpicture=res['picture'];
        let obj={
          username:this.fusername,
          fullname:this.ffullname,
          birthdate:this.fbirthdate,
          picture: this.fpicture
        }
        console.log(obj);
        if(key==this.userUID){
          this.thisisyou();
          return;
        }
        this.firebaseServ.getFriends(this.userUID).snapshotChanges().pipe(
          map(changes => changes.map(
            c => ({
              key: c.payload.key, ...c.payload.val()
            })
          ))
        ).subscribe(data => {
          this.friend = data;
          //console.log(this.friend);
          if(!this.added){
            for(let alreadyfriend of this.friend){
              console.log('masuk kesini');
              if(alreadyfriend.key==key){
                  console.log('already fren');
                  this.alreadyfren();
                  this.added=true;
                  return;
              }
              else {
                  this.nowfriends();
                  console.log('gonna add this one');
                  this.added=true;
                  this.firebaseServ.addFriend(obj, key, this.userUID).then(res => {
                  }).catch(error => console.log(error));      
              } 
            }  
          }
          if(this.friend.length==0){ 
            console.log('adding!');
            this.firebaseServ.addFriend(obj, key, this.userUID).then(res => {
            }).catch(error => console.log(error));    
            this.nowfriends();
            this.added=true;  
          }                  
        });
      });
      this.added=false;      
    }

    async nowfriends() {
      const toast = await this.toast.create({
        message: 'You are now friends!',
        duration: 2000
      });
      toast.present();
    }

    async thisisyou() {
      const toast = await this.toast.create({
        message: 'You can not add yourself!',
        duration: 2000
      });
      toast.present();
    }
    async alreadyfren() {
      const toast = await this.toast.create({
        message: 'You are already friends with this person ^^',
        duration: 2000
      });
      toast.present();
    }

}
