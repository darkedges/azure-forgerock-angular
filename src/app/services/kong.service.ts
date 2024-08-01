import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

export interface PatientRecord {
    id: string
    patient: string
    doctor: string
    region: string
    notes: string
}

@Injectable({
    providedIn: 'root'
})
export class KongService {
    constructor(
        private http: HttpClient
    ) { }

    getPatientRecord(accessToken: string, index: string) {
        const url = environment.patientRecord.uri + index;
        let options = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + accessToken
            })
        };
        return this.http.get<PatientRecord>(url, options);
    }
}