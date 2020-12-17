import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { NavController } from '@ionic/angular';
import { map } from 'rxjs/operators/';
import { FirebaseService } from 'src/app/firebase.service';
import { Profile } from 'src/app/profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userUID:any;
  username:any;
  fullname:string;
  birthdate:Date;
  picture:any;

  location:any;


  constructor(
    private navCtrl:NavController,
    private firebaseServ:FirebaseService,
    private db: AngularFireDatabase
  ) { }

  ngOnInit(){    
    this.firebaseServ.userDetails().subscribe(res =>{
      if (res !== null) {
        this.userUID = res.uid;
        this.db.object('/profile/'+this.userUID).valueChanges().subscribe(res => {
          this.username=res['username'];
          this.fullname=res['fullname'];
          this.birthdate=res['birthdate'];
          this.picture=res['picture'];
        });

        this.firebaseServ.getUserLocation(this.userUID).snapshotChanges().pipe(
          map(changes => changes.map(
            c => ({
              key: c.payload.key, ...c.payload.val()
            })
          ))
        ).subscribe(data => {
          this.location = data;
          console.log(this.location);
        });
    
      } else {
        this.navCtrl.navigateBack('/login');
      }
    });
  }

  ionViewWillEnter(){
  }  

  deleteLoc(loc) {
    console.log(loc.key);
    this.db.object('/location/'+this.userUID+'/'+ loc.key).remove();
  }

  logout(){
    this.firebaseServ.logoutUser();
  }



}
