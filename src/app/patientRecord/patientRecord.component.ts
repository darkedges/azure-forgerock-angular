import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

type PatientRecordType = {
  givenName?: string;
  surname?: string;
  userPrincipalName?: string;
  id?: string;
};

@Component({
  selector: 'app-patientRecord',
  templateUrl: './patientRecord.component.html',
  styleUrls: [],
  standalone: true,
})
export class PatientRecordComponent implements OnInit {
  patientRecord: PatientRecordType | undefined;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getKong(environment.patientRecord.uri);
  }

  getKong(url: string) {
    this.http.get(url).subscribe((patientRecord) => {
      this.patientRecord = patientRecord;
    });
  }
}
