import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-appointment-dialog',
  templateUrl: './create-appointment-dialog.component.html',
  styleUrls: ['./create-appointment-dialog.component.scss']
})
export class CreateAppointmentDialogComponent implements OnInit {

  specialties: string[] = ['Alergologie', 'Balneofizioterapie','Cardiologie','Dermatologie','Endocrinologie','Epidemiologie','Gastroenterologie','Genetica medicala','Hematologie','Hepatologie','Nefrologie','Neonatologie','Neurochirurgie','Neurologie','Ginecologie','Oftalmologie','Oncologie','Ortopedie','Patologie','Pediatrie','Psihiatrie','Reumatologie','Stomatologie','Urologie'];
  cities: string[] = ['Bacau','Iasi','Bucuresti'];
  availableHours: string[] = ['8:00','8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'];
  step: number = 1; 
  _consentChecked: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<CreateAppointmentDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

  get currentDate(): Date { 
    return new Date();
  }

  get consentChecked(): boolean {
    return this._consentChecked;
  }

  consentCheckboxToggle(event: any) {
    this._consentChecked = event.checked;
  }

  onNextStep(): void {
    if(this.step < 5) {
      this.step++;
    }
  }

  onPreviousStep(): void {
    if(this.step > 1) {
      this.step--;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
