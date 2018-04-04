import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  choice: Observable<any[]>;
  constructor(public auth: AuthService, db: AngularFirestore) {
    this.choice = db.collection('choice').valueChanges();
  }
  ngOnInit() {
  }

}
