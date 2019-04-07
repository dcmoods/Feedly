import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { FeedPage } from '../pages/feed/feed';

import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyCWr3KRM2QPF7vYycpG_ai1jsXOk-8qWvk",
  authDomain: "feedly-c9292.firebaseapp.com",
  databaseURL: "https://feedly-c9292.firebaseio.com",
  projectId: "feedly-c9292",
  storageBucket: "feedly-c9292.appspot.com",
  messagingSenderId: "465803475589"
};

firebase.initializeApp(config);
firebase.firestore().settings({
  timestampsInSnapshots: true
})

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    FeedPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    FeedPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
