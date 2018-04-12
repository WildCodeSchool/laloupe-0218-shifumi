import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  rulesClic: number;

  constructor() {
    this.rulesClic = 0;
  }
  ngOnInit() {
  }

}
