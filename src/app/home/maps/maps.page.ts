import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { FirebaseService } from 'src/app/firebase.service';
import { map } from 'rxjs/operators/';
declare var google:any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  centered:boolean=false;
  map:any;
  userUID:any;
  lat:any;
  lng:any;
  fLat:any;
  fLng;
  friends:any;
  location:any;

  infoWindow:any=new google.maps.InfoWindow();
  @ViewChild('map',{read:ElementRef,static:false}) mapRef:ElementRef;

  umnPos:any={
    lat: -6.256081,
    lng:106.618755
  }

  constructor(
    private navCtrl:NavController,
    private firebaseServ:FirebaseService,
    private toast:ToastController
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
          this.friends = data;
          console.log(this.friends);

          if(this.friends==null||this.friends.length==0){
            return
          }
            this.firebaseServ.getLastLocation(this.userUID).snapshotChanges().pipe(
              map(changes => changes.map(
                c => ({
                  key: c.payload.key, ...c.payload.val()
                })
              ))
            ).subscribe(data => {
              this.location = data;
              console.log(this.location);

              for(let loc of this.location){
                for(let friend of this.friends){
                this.fLat = loc.lat;
                this.fLng = loc.lng;
                if(navigator.geolocation){
                  console.log(friend);
                  const pos = {
                    lat:this.fLat,
                    lng:this.fLng
                  };
                  console.log(pos);
                  const marker = new google.maps.Marker({
                    position:pos,
                    content:friend.username,
                    title:friend.username,
                    label:friend.username,
                    map:this.map
                  })   
              }  
                }
              }
              
            });
          
        });     
      } else {
        this.navCtrl.navigateBack('/login');
      }
    });
  }

  ionViewDidEnter(){
    this.showMap(this.umnPos);
  }

  centerLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position:any)=>{
        const pos = {
          lat:position.coords.latitude,
          lng:position.coords.longitude
        };
        console.log(pos);
        this.lat=pos.lat;
        this.lng=pos.lng;
        this.infoWindow.setPosition(pos);
        this.infoWindow.setContent('Your current location');
        this.infoWindow.open(this.map);
        this.map.setCenter(pos);
        this.centered=true;
      });
    }
    this.confirm();

  }

  showMap(pos:any){
    const location = new google.maps.LatLng(pos.lat,pos.lng);
    const options = {
      center:location,
      zoom:16,
      disableDefaultUI:true
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
  }

  checkIn(){
    if(this.centered){
      let currDate:any=new Date().toISOString();
      let obj = {
        time: currDate,
        lat: this.lat,
        lng:this.lng
      }
      this.firebaseServ.checkIn(obj, this.userUID).then(res => {
      }).catch(error => console.log(error));
      this.centered=false;
      this.checkedIn();
    }else
    this.presentToast();
  }

  async presentToast() {
    const toast = await this.toast.create({
      message: 'Please confirm your location first!',
      duration: 2000
    });
    toast.present();
  }

  async confirm() {
    const toast = await this.toast.create({
      message: 'You have confirmed your location!',
      duration: 2000
    });
    toast.present();
  }

  async checkedIn() {
    const toast = await this.toast.create({
      message: 'You have checked in!',
      duration: 2000
    });
    toast.present();
  }

}
