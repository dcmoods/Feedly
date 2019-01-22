import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import firebase from 'firebase';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  name: string = "";
  email: string = "";
  password: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
     public toastCtrl: ToastController, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  signUp() {
   // console.log(this.name, this.email, this.password);
   firebase.auth()
    .createUserWithEmailAndPassword(this.email, this.password)
      .then((data) => {

        let newUser: firebase.User = data.user;
        newUser.updateProfile({
          displayName: this.name,
          photoURL: ""
        }).then(() => {
          console.log("Profile updated.");

          this.alertCtrl.create({
            title: "Account Created",
            message: "Your acount has been created successfully.",
            buttons: [
              {
                text: "OK",
                handler: () => {
                  //navigate to the feeds page
                }
              }
            ]
          }).present();

        }).catch((err) => {
          console.log(err);
        });

        
      })
      .catch((err) => {
        console.log(err);
        this.toastCtrl.create({
          message: err.message,
          duration: 3000
        }).present();
      });
  }

  goback() {
    this.navCtrl.pop();
  }

}
