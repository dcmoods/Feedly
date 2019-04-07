import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import moment from 'moment';

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


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.getPosts();
  }

  getPosts(){
    //this.posts = [];
    firebase.firestore().collection("posts")
      .orderBy("created", "desc")
      .limit(this.pageSize).get()
      .then((docs) => {

        docs.forEach((doc) => {
          this.posts.push(doc);
        })

        this.cursor = this.posts[this.posts.length - 1];

        console.log(docs)
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
    this.posts = [];

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
      this.getPosts()
    }).catch((err) => {
      console.log(err)
    })

  }

  ago(time){
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }
}
