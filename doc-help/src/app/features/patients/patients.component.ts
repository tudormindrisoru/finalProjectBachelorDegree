import { PatientsService, AppointmentHistory } from './patients.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface HistoryAppointmentsTableRow {
  id: string;
  name: string;
  phone: string;
  date: string;
  startHour: string;
  endHour: string;
  reported: boolean;
  reports: number;
}
@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'phone', 'date', 'start_hour', 'end_hour','reports'];
  tableData: HistoryAppointmentsTableRow[] = [];
  dataSource = new MatTableDataSource<HistoryAppointmentsTableRow>(this.tableData);
  appointments: AppointmentHistory[] = [];
  clickedRows = new Set<AppointmentHistory>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private patientService: PatientsService) {

    this.appointments = this.patientService.appointmentsHistory;
    this.initTableData();
   }
  
  ngOnInit(): void {
  }
  
  initPaginator(): void {
    this.dataSource.paginator = this.paginator;
  }
  
  initTableData(): void {
    
    // console.log(this.appointments);
    this.appointments.forEach((element: AppointmentHistory) => {
      this.tableData.push({
        id: element.id,
        name: (element.patient.firstName + ' ' + element.patient.lastName),
        phone: element.patient.phoneNumber,
        date: element.date.toLocaleDateString('ro-RO'),
        startHour: element.startHour,
        endHour: element.endHour,
        reports: element.patient.reports,
        reported: element.reported
      } as HistoryAppointmentsTableRow)
    });

    // console.log('data loaded: ',tableData);
    // this.dataSource = new MatTableDataSource<HistoryAppointmentsTableRow>(tableData);
    this.initPaginator();
  }

  onReportPatient(event:Event, history) {
    event.stopPropagation();
    console.log(event,history);
    const HISTORY_INDEX = this.tableData.findIndex((element) => element.id === history.id);
    this.tableData[HISTORY_INDEX].reported = !this.tableData[HISTORY_INDEX].reported;
  }

  onRowClick(row: any): void {
    console.log(row);
  }

  get currentDate(): Date { 
    return new Date();
  }

}