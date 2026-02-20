import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  user$ = user(this.auth);
  currentUserSig = signal<User | null>(null);

  constructor() {
    this.user$.subscribe(user => {
      this.currentUserSig.set(user);
    });
  }

  register(email: string, pass: string, firstName: string, lastName: string, photoURL: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.auth, email, pass)
      .then(credential => {
        // Update the user's profile with display name and photo URL
        const displayName = `${firstName} ${lastName}`;
        return import('@angular/fire/auth').then(({ updateProfile }) => 
          updateProfile(credential.user, { displayName, photoURL })
        );
      })
      .then(() => {
        // Optional: ensure Firestore document exists if needed, but for now Auth profile is sufficient for display
      });
    return from(promise) as Observable<void>;
  }

  login(email: string, pass: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.auth, email, pass).then(() => {});
    return from(promise) as Observable<void>;
  }

  logout(): Observable<void> {
    const promise = signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
    return from(promise) as Observable<void>;
  }
}
