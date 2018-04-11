import { Player } from './player';

export class Room {
    players: Player[];
    turn: number;
    count: number;
    matchLog: string[];
    roundWon: boolean = false;
}