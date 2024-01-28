export class Product {
    id: string;
    name: string;
    brand: string;
    description: string;
    discountedPrice: string;
    campaignQuantity: string;
    category: string;
    restrictions: string;

    constructor(id: string) {
        this.id = id;
        this.name = '';
        this.brand = '';
        this.description = '';
        this.discountedPrice = '';
        this.campaignQuantity = '';
        this.restrictions = '';
        this.category = '';
    }
}