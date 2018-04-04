import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Room } from '../models/room';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  message = 'Waiting for opponent';
  roomId: string;
  username: string;
  room: Room;
  myPlayerId: number;

  choice: Observable<any[]>;
  rooms: Observable<any[]>;
  constructor(private route: ActivatedRoute, public auth: AuthService, private db: AngularFirestore) {
    this.choice = db.collection('choice').valueChanges();
    this.rooms = db.collection('rooms').valueChanges();
  }
  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('id');
    this.username = this.route.snapshot.paramMap.get('username');

    this.db
      .doc<Room>('rooms/' + this.roomId)
      .valueChanges()
      .subscribe((room) => {
        this.room = room;
        this.myPlayerId = room.players[0].name === this.username ? 0 : 1;
        if (room.players.length === 2) {
          this.message = 'Starting game';
          if (room.players[0].name === this.username) {

          }
        }
      });
  }

}
