import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Profile } from './profile.model';
import { Friend } from './friend.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private dbPath = '/profile';
  private friendPath = '/friends';
  profileRef: AngularFireList<Profile>;
  friendsRef: AngularFireList<Friend>;
  locationRef: AngularFireList<Location>;

  dataD: AngularFireObject<Profile> = null; 

  constructor(
    private auth:AngularFireAuth, 
    private db: AngularFireDatabase,
    private firestore: AngularFirestore) {
    this.profileRef = this.db.list(this.dbPath);
    this.friendsRef = this.db.list(this.friendPath);
   }

  create(profile: Profile,userUID){
    console.log(profile);
    return this.profileRef.set(userUID, profile);
  }

  checkIn(location, userUID){
    console.log(location);
    return this.db.list('location/'+userUID).push(location);
  }

  addFriend(friend, key, userUID){
    console.log(friend);
    return this.db.list('friends/'+userUID).set(key,friend);
  }

  registerUser(value){
    return new Promise<any>((resolve,reject)=>{
      this.auth.createUserWithEmailAndPassword(value.email,value.password)
      .then(
        res=>resolve(res),
        err=>reject(err)
      );
    });
  }

  loginUser(value){
    return new Promise<any>((resolve,reject)=>{
      this.auth.signInWithEmailAndPassword(value.email,value.password)
      .then(
        res=> resolve(res),
        err=>reject(err)
      );
    });
  }

  logoutUser(){
    return new Promise<void>((resolve, reject) => {
      if (this.auth.currentUser) {
        this.auth.signOut()
          .then(() => {
            console.log("log out");
            resolve();
          }).catch((error) => {
            reject();
          });
      }
    });  
  }

  userDetails(){//auth detail
    return this.auth.user;
  }
  
  getUsers():AngularFireList<Profile>{
    return this.db.list('profile/');
  }

  getUser(search):AngularFireList<Profile>{
    return this.db.list('profile/', ref=>ref.orderByChild('username').equalTo(search));
  }

  getFriends(userUID):AngularFireList<Friend>{
    return this.db.list('friends/'+userUID);
  }
  getUserLocation(id):AngularFireList<Location>{
    return this.db.list('location/'+id);
  }  
  getLastLocation(id):AngularFireList<Location>{
    return this.db.list('location/'+id, ref=>ref.orderByChild('time').limitToLast(1));
  }

  

}
