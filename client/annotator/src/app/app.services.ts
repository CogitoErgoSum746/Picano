export class Product {
    id: string;
    name: string;
    brand: string;
    description: string;
    discountedPrice: string;
    campaignQuantity: string;
    category: string;
    restrictions: string;
    from: Date | undefined;
    to: Date | undefined;

    constructor (
        id: string, name?: string, brand?: string,
        description?: string, discountedPrice?: string, 
        campaignQuantity?: string, restrictions?: string,
        category?: string, from?: Date, to?: Date
    ) {
        this.id = id;
        this.name = name ?? '';
        this.brand = brand ?? '';
        this.description = description ?? '';
        this.discountedPrice = discountedPrice ?? '';
        this.campaignQuantity = campaignQuantity ?? '';
        this.restrictions = restrictions ?? '';
        this.category = category ?? '';
        this.from = from ?? undefined;
        this.to = to ?? undefined;
    }
}