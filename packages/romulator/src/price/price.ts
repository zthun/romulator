export interface IZRomulatorPrice {
  amount: number;
  currency: string;
}

export class ZRomulatorPriceBuilder {
  private _price: IZRomulatorPrice = { amount: 0, currency: "USD" };

  public amount(amount: number): this {
    this._price.amount = amount;
    return this;
  }

  public currency(currency: string): this {
    this._price.currency = currency;
    return this;
  }

  public build(): IZRomulatorPrice {
    return structuredClone(this._price);
  }
}
