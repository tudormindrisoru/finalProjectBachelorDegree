import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateAppointmentDialogComponent } from 'src/app/shared/components/create-appointment-dialog/create-appointment-dialog.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  // header = document.getElementById('header');

  mobileView: boolean = window.innerWidth > 768 ? false : true;
  @HostListener('window:resize', ['$event']) onResize(event) {
    this.mobileView = event.target.innerWidth > 768 ? false : true;
    console.log(this.mobileView);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const number = event.target['scrollingElement'].scrollTop;
    if (number > 80) {
      document.getElementById('header').style.backgroundColor = '#64b3f4';
      document.getElementById('header').style.height = '70px';
      document.getElementById('logo').style.height = '50px';
      document
        .getElementById('logo')
        .children[0].querySelector<HTMLElement>('img').style.display = 'none';
      document
        .getElementById('logo')
        .children[0].querySelector<HTMLElement>(
          '.text-wrapper > h2'
        ).style.top = '-10px';
      document
        .getElementById('logo')
        .children[0].querySelector<HTMLElement>(
          '.text-wrapper h2:nth-child(2)'
        ).style.top = '20px';
      document.getElementById('logo').style.margin = '10px';
    } else {
      document.getElementById('header').style.backgroundColor = 'transparent';
      document
        .getElementById('logo')
        .children[0].querySelector<HTMLElement>(
          '.text-wrapper > h2'
        ).style.top = '20px';
      document
        .getElementById('logo')
        .children[0].querySelector<HTMLElement>(
          '.text-wrapper h2:nth-child(2)'
        ).style.top = '55px';
      document
        .getElementById('logo')
        .children[0].querySelector<HTMLElement>('img').style.display =
        'inline-block';
      document.getElementById('logo').style.margin = '20px';
    }
  }

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}
  public openCreateAppointmentDialog(): void {
    this.dialog.open(CreateAppointmentDialogComponent, { disableClose: true });
  }
}
