import { Component, EventEmitter, Input, Output } from '@angular/core';
import { API } from '../../config/API';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    // Pass user to parent component.
    @Output() authenticated: EventEmitter<Boolean> = new EventEmitter();
    message: string = '';

    async handleSubmit(event: Event) {
        event.preventDefault();
        const form = <HTMLFormElement>event.target;
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());
        const response = await fetch(API.login, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success === false) {
            this.message = data.message;
            localStorage.clear();
        }

        if (data.success === true) {
            this.message = '';
            localStorage.setItem("jwt", data.authtoken);
            this.authenticated.emit(true);
        }
    }
}
