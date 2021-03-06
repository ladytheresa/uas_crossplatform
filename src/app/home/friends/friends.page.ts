import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/firebase.service';
import { map } from 'rxjs/operators/';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  userUID:any;
  friend:any;

  constructor(
    private db: AngularFireDatabase,
    private firebaseServ:FirebaseService,
    private navCtrl:NavController,

  ) { }

  ngOnInit() {
    this.firebaseServ.userDetails().subscribe(res =>{
      if (res !== null) {
        this.userUID = res.uid;
        this.firebaseServ.getFriends(this.userUID).snapshotChanges().pipe(
          map(changes => changes.map(
            c => ({
              key: c.payload.key, ...c.payload.val()
            })
          ))
        ).subscribe(data => {
          this.friend = data;
          console.log(this.friend);
        });
    
      } else {
        this.navCtrl.navigateBack('/login');
      }
    });
  }

  delete(fren){
    console.log(fren.key);
    this.db.object('/friends/'+this.userUID+'/'+ fren.key).remove();
  }
  addPage(){
    this.navCtrl.navigateForward('/addfriend');
  }
  refresh(): void { window.location.reload(); }

}
