import { Player } from './player';

export class Room {
    players: Player[];
    turn: number;
    winner: number;
}