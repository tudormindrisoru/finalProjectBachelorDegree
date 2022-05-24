import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Appointment } from 'src/app/shared/models/models';

@Component({
  selector: 'app-notifications-popup',
  templateUrl: './notifications-popup.component.html',
  styleUrls: ['./notifications-popup.component.scss'],
})
export class NotificationsPopupComponent implements OnInit {
  @Input() pendingAppointments: Appointment[];

  @Output() accept: EventEmitter<number> = new EventEmitter();
  @Output() reject: EventEmitter<number> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {}

  onAccept(id): void {
    this.accept.emit(id);
  }

  onReject(id): void {
    this.reject.emit(id);
  }

  onClose(): void {
    this.close.emit();
  }

  getProfileImg(src: string | undefined): string {
    return this.profileService.getProfileImage(src);
  }
}
