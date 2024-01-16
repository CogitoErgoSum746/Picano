import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chain-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chain-selector.component.html',
  styleUrl: './chain-selector.component.css'
})
export class ChainSelectorComponent {
    groups: string[] = [];

    ngOnInit() {
        this.loadGroups();
    }

    // Fetches and assigns groups.
    async loadGroups() {
        const response = await fetch('http://localhost:8000/api/groups');
        const responseObject = await response.json();
        console.log(responseObject);
        this.groups = responseObject;
    }
}
