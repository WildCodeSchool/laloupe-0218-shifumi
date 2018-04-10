import { element } from 'protractor';
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

  message = "wait please ! a player will arrive";
  roomId: string;
  username: string;
  room: Room;
  myPlayerId: number;
  myVar;
  scoreJ1;
  scoreJ2;
  player1;
  player2;
  victoryPlayer1;
  victoryPlayer2;

  choice: Observable<any[]>;
  rooms: Observable<any[]>;
  constructor(private route: ActivatedRoute, public auth: AuthService, private db: AngularFirestore) {
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
          this.message = 'start game';
          this.player1 = this.room.players[0].name;
          this.player2 = this.room.players[1].name;
        }
      });
  }

  victory() {
    if (this.room.players[0].roundWin % 3 === 0) {
      this.room.players[0].victory = this.room.players[0].victory + 1;
    } else if (this.room.players[1].roundWin % 3 === 0) {
      this.room.players[1].victory = this.room.players[1].victory + 1;
    }
    this.db.doc('rooms/' + this.roomId).update(JSON.parse(JSON.stringify(this.room)));
  }

  continue() {
    if (this.room.players[0].name === this.username) {
      this.room.players[0].again = 1;
      alert("Demande envoyé");
    } else if (this.room.players[1].name === this.username) {
      this.room.players[1].again = 1;
      alert("Demande envoyé");
    }
    this.db.doc('rooms/' + this.roomId).update(JSON.parse(JSON.stringify(this.room)));
  }

  isMyTurn(): boolean {
    this.victoryPlayer1 = this.room.players[0].victory;
    this.victoryPlayer2 = this.room.players[1].victory;
    this.scoreJ1 = this.room.players[0].roundWin;
    this.scoreJ2 = this.room.players[1].roundWin;
    // console.log(this.room.players[this.room.turn].name, this.username);
    return this.room && this.room.turn !== undefined && this.room.players[this.room.turn].name == this.username;
  }

  manche() {
    if (this.room.count % 2 === 0) {
      let choiceJone = this.room.players[0].action[this.room.players[0].action.length - 1];
      let choiceJtwo = this.room.players[1].action[this.room.players[1].action.length - 1];
      this.match(choiceJone, choiceJtwo);
    }
    if ((this.room.players[0].again === 1 && this.room.players[1].again === 1) && (this.room.players[0].roundWin % 3 != 0 && this.room.players[1].roundWin % 3 != 0)) {
      this.room.players[0].again = 0;
      this.room.players[1].again = 0;
    }
  }

  match(arg1: string, arg2: string) {
    if (arg1 == arg2) {
      this.room.matchLog.push("match nul");
    } if (arg1 == "pierre" && arg2 == "feuille") {
      this.winRoundPlayer2();
    } if (arg1 == "pierre" && arg2 == "ciseaux") {
      this.winRoundPlayer1();
    } if (arg1 == "feuille" && arg2 == "pierre") {
      this.winRoundPlayer1();
    } if (arg1 == "feuille" && arg2 == "ciseaux") {
      this.winRoundPlayer2();
    } if (arg1 == "ciseaux" && arg2 == "pierre") {
      this.winRoundPlayer2();
    } if (arg1 == "ciseaux" && arg2 == "feuille") {
      this.winRoundPlayer1();
    }
  }

  winRoundPlayer1() {
    this.room.matchLog.push("Victoire de " + this.room.players[0].name);
    this.room.players[0].roundWin = this.room.players[0].roundWin + 1;
  }

  winRoundPlayer2() {
    this.room.matchLog.push("Victoire de " + this.room.players[1].name);
    this.room.players[1].roundWin = this.room.players[1].roundWin + 1;
  }

  pierre() {
    if (this.room.players[0].name === this.username) {
      this.room.players[0].action.push("pierre");
      this.room.turn = 1;
    } else if (this.room.players[1].name === this.username) {
      this.room.players[1].action.push("pierre");
      this.room.turn = 0;
    }
    this.room.count = this.room.count + 1;
    this.manche();
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
    this.room.count = this.room.count + 1;
    this.manche();
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
    this.room.count = this.room.count + 1;
    this.manche();
    this.db.doc('rooms/' + this.roomId).update(JSON.parse(JSON.stringify(this.room)));
  }

}