import { Inject, Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user'; 
import { AuthResponse } from '../models/auth-response'; 
import { BROWSER_STORAGE } from '../storage'; 
import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  baseUrl = 'http://localhost:3000/api'; 

  constructor( 
    private http: HttpClient, 
    @Inject(BROWSER_STORAGE) private storage: Storage 
  ) {}

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/trips`);
  }

  addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.baseUrl, formData);
  }

  getTrip(tripCode: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/${tripCode}`);
  }

  updateTrip(formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.baseUrl}/${formData.code}`, formData);
  }

  // Call to our /login endpoint, returns JWT 
  login(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('login', user, passwd);
  }

  // Call to our /register endpoint, creates user and returns JWT 
  register(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('register', user, passwd);
  }

  // Helper method to process both login and register methods 
  handleAuthAPICall(endpoint: string, user: User, passwd: string): Observable<AuthResponse> {
    let formData = { 
      name: user.name, 
      email: user.email, 
      password: passwd 
    };

    return this.http.post<AuthResponse>(`${this.baseUrl}/${endpoint}`, formData);
  }
}
