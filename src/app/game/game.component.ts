import { Room } from './../models/room';
import { MatchMakingComponent } from './../match-making/match-making.component';
import { Player } from './../models/player';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  message = "Attente d'un joueur";
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
        }
      });
  }

  isMyTurn(): boolean {
    // console.log(this.room.players[this.room.turn].name, this.username);
    return this.room && this.room.turn !== undefined && this.room.players[this.room.turn].name == this.username;
  }

  pierre() {
    if (this.room.players[0].name === this.username) {
      this.room.players[0].action.push("pierre");
      this.room.turn = 1;
    } else if (this.room.players[1].name === this.username) {
      this.room.players[1].action.push("pierre");
      this.room.turn = 0;
    }
    this.db.doc('rooms/' + this.roomId).update(JSON.parse(JSON.stringify(this.room)));
  }
  feuille() {
    if (this.room.players[0].name === this.username) {
      this.room.players[0].action.push("feuille");
      this.room.turn = 1;
    } else if (this.room.players[1].name === this.username) {
      this.room.players[1].action.push("feuille");
      this.room.turn = 0;
    }
    this.db.doc('rooms/' + this.roomId).update(JSON.parse(JSON.stringify(this.room)));
  }
  ciseaux() {
    if (this.room.players[0].name === this.username) {
      this.room.players[0].action.push("ciseaux");
      this.room.turn = 1;
    } else if (this.room.players[1].name === this.username) {
      this.room.players[1].action.push("ciseaux");
      this.room.turn = 0;
    }
    this.db.doc('rooms/' + this.roomId).update(JSON.parse(JSON.stringify(this.room)));
  }

}