export class Product {
    id: string;
    name: string;
    brand: string;
    description: string;
    discoutedPrice: string;
    campaignQuantity: string;
    restrictions: string;

    constructor(id: string) {
        this.id = id;
        this.name = '';
        this.brand = '';
        this.description = '';
        this.discoutedPrice = '';
        this.campaignQuantity = '';
        this.restrictions = '';
    }
}