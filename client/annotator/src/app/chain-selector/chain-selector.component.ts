import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

type DataNode = {
    id: string;
    value: string;
}

@Component({
  selector: 'app-chain-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chain-selector.component.html',
  styleUrl: './chain-selector.component.css'
})
export class ChainSelectorComponent {
    groups: DataNode[] = [];
    chains: DataNode[] = [];
    stores: DataNode[] = [];
    chainCategories: DataNode[] = [];
    disableInput: Boolean = false;

    apiUrl = environment.apiUrl;

    ngOnInit() {
        this.loadData();
    }

    // Fetches and assigns dataLists.
    async loadData(field = '', id = '', value = '') {
        // Disable user input until data is fetched
        // and auto completed.
        this.disableInput = true;

        let url = `${this.apiUrl}/api/auto-dropdown`;

        // Update url with query params if filter is available.
        if (field)
            url = `${this.apiUrl}/api/auto-dropdown?${field}[id]=${id}&${field}[value]=${value}`;

        const response = await fetch(url);
        const data = await response.json();
        this.groups = data.group;
        this.chainCategories = data.chain_category;
        this.chains = data.chain;
        this.stores = data.store;

        this.autoFillInputs();
    }

    // autoFillInputs fills input fields
    // if the dropdowns contains just one field.
    autoFillInputs() {
        if (this.groups.length === 1) {
            const input = <HTMLInputElement>document.getElementById('groups-input');
            input.value = this.groups[0].value;
        }
        if (this.chainCategories.length === 1) {
            const input = <HTMLInputElement>document.getElementById('categories-input');
            input.value = this.chainCategories[0].value;
        }
        if (this.chains.length === 1) {
            const input = <HTMLInputElement>document.getElementById('chains-input');
            input.value = this.chains[0].value;
        }
        if (this.stores.length === 1) {
            const input = <HTMLInputElement>document.getElementById('stores-input');
            input.value = this.stores[0].value;
        }
        this.disableInput = false;
    }

    // handles formChange and decides if
    // we have to update the dropdown contents.
    handleChange(event: Event) {
        const { id, value } = <HTMLInputElement>event.target;
        let queryParamKey = '';
        let data: DataNode | undefined;
        if (id === 'groups-input') {
            queryParamKey = 'group';
            data = this.groups.find(e => e.value === value);
        } else if (id === 'categories-input') {
            queryParamKey = 'chain_category';
            data = this.chainCategories.find(e => e.value === value);
        } else if (id === 'chains-input') {
            queryParamKey = 'chain';
            data = this.chains.find(e => e.value === value);
        } else if (id === 'stores-input') {
            queryParamKey = 'store';
            data = this.stores.find(e => e.value === value);
        }

        // Refetch data if data exists.
        if (data) this.loadData(queryParamKey, data.id, data.value);
    }

    submitCampaign(event: Event) {
        console.log(new FormData(<HTMLFormElement>event.target));
        // TODO: POST API to submit data.
    }
}
