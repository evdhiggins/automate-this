import Airtable = require("Airtable");

export default class {
  private id: string;
  private fields: Airtable.RecordData;
  public isUpdated: boolean = false;

  constructor(record: Airtable.Record) {
    this.id = record.getId();
    this.fields = record.fields;
  }

  public getId(): string {
    return this.id;
  }

  /**
   * Return a shallow copy of record fields
   */
  public getFields(): Airtable.RecordData {
    return Object.assign({}, this.fields);
  }

  public getUpdate(obj: this) {
    const func = (newFields: Airtable.RecordData) => {
      this.isUpdated = true;
      this.fields = Object.assign({}, this.fields, newFields);
    };
    func.bind(obj);
    return func;
  }
}
