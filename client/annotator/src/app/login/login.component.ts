import { Component } from '@angular/core';
import { API } from '../../config/API';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    handleSubmit(event: Event) {
        event.preventDefault();
        const form = <HTMLFormElement>event.target;
        const formData = new FormData(form);
        const payload = {
            "username": "h",
            "password": "h"
        };
        const response = fetch(API.login, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        // TODO: set JWT in localStorage.
        // set this.user to user.
    }
}
