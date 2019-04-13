import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import firebase from 'firebase';
import moment from 'moment';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

  text: string = "";
  posts: any[] = [];
  pageSize: number = 10;
  cursor: any;
  infiniteEvent: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.getPosts();
  }

  getPosts(){
    this.posts = [];

    let loading = this.loadingCtrl.create({
      content: "Loading Feed..."
    });
    loading.present();

    let query = firebase.firestore().collection("posts")
      .orderBy("created", "desc")
      .limit(this.pageSize);
      
      // query.onSnapshot((snapshot) => {
      //   let changedDocs = snapshot.docChanges();

      //   changedDocs.forEach((change) => {
      //     if(change.type == "added"){

      //     }

      //     if(change.type == "modified"){
            
      //     }

      //     if(change.type == "removed"){
            
      //     }
      //   })
      // });

      query.get()
      .then((docs) => {

        docs.forEach((doc) => {
          this.posts.push(doc);
        })

        loading.dismiss();

        this.cursor = this.posts[this.posts.length - 1];

        console.log(this.posts)
      }).catch((err) =>{
        console.log(err)
      })
  }

  loadMorePosts(event){
    firebase.firestore().collection("posts")
      .orderBy("created", "desc")
      .startAfter(this.cursor)
      .limit(this.pageSize).get()
      .then((docs) => {

        docs.forEach((doc) => {
          this.posts.push(doc);
        })
        
        console.log(docs)

        if(docs.size < this.pageSize){
          event.enable(false);
          this.infiniteEvent = event;
        } else {
          event.complete();
          this.cursor = this.posts[this.posts.length - 1];
        }
      }).catch((err) =>{
        console.log(err)
      })
  }

  refresh(event){
    //this.posts = [];

    this.getPosts();
    event.complete();
    if(this.infiniteEvent){
      this.infiniteEvent.enable(true);
    }
  }

  post(){
    firebase.firestore().collection("posts").add({
      text: this.text,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: firebase.auth().currentUser.uid,
      owner_name: firebase.auth().currentUser.displayName
    }).then((doc) => {
      console.log(doc)
      this.text = "";

      this.toastCtrl.create({
        message: "Your post has been created.",
        duration: 3000
      }).present();

      this.getPosts();
    }).catch((err) => {
      console.log(err)
    })

  }

  ago(time){
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }

  logout(){
    
    firebase.auth().signOut().then(() => {

      this.toastCtrl.create({
        message: "You have been logged out.",
        duration: 3000
      }).present();

      this.navCtrl.setRoot(LoginPage);
    });
    
  }
}
