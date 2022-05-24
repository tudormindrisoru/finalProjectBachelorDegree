import { HttpResponse } from '@angular/common/http';
import { PatientsService, AppointmentHistory } from './patients.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Appointment, Response } from 'src/app/shared/models/models';

export interface HistoryAppointmentsTableRow {
  id: number;
  name: string;
  phone: string;
  date: string;
  startHour: string;
  endHour: string;
}
@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'phone',
    'date',
    'start_hour',
    'end_hour',
  ];
  tableData: HistoryAppointmentsTableRow[] = [];
  dataSource = new MatTableDataSource<HistoryAppointmentsTableRow>(
    this.tableData
  );
  appointments: Appointment[] = [];
  clickedRows = new Set<AppointmentHistory>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private patientService: PatientsService) {}

  ngOnInit(): void {
    this.getPatientHistory();
  }

  getPatientHistory(): void {
    this.patientService
      .getHistory()
      .subscribe((response: HttpResponse<Response<Appointment[]>>) => {
        if (response.body.success) {
          this.appointments = response.body.message;
          this.initTableData();
        }
      });
  }

  initPaginator(): void {
    this.dataSource.paginator = this.paginator;
  }

  initTableData(): void {
    // console.log(this.appointments);
    this.appointments.forEach((element: Appointment) => {
      const startH = new Date(element.startDate).getHours();
      const startM = new Date(element.startDate).getMinutes();
      const endH = new Date(element.endDate).getHours();
      const endM = new Date(element.endDate).getMinutes();
      const data = {
        id: element.id,
        name: element.patient.firstName + ' ' + element.patient.lastName,
        phone: element.patient.phone,
        date: new Date(element.startDate).toLocaleDateString('ro-RO'),
        startHour:
          (startH === 0 ? `0${startH}` : startH) +
          ':' +
          (startM === 0 ? `0${startM}` : startM),
        endHour:
          (endH === 0 ? `0${endH}` : endH) +
          ':' +
          (endM === 0 ? `0${endM}` : endM),
      };
      this.tableData.push(data as HistoryAppointmentsTableRow);
    });

    // console.log('data loaded: ',tableData);
    // this.dataSource = new MatTableDataSource<HistoryAppointmentsTableRow>(tableData);
    this.initPaginator();
  }

  onReportPatient(event: Event, history) {
    event.stopPropagation();
    console.log(event, history);
    const HISTORY_INDEX = this.tableData.findIndex(
      (element) => element.id === history.id
    );
  }

  onRowClick(row: any): void {
    console.log(row);
  }

  get currentDate(): Date {
    return new Date();
  }
}
