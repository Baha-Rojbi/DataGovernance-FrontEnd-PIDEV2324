export interface Schema {
    idSchema: number;
    name: string;
    type: string;
    description: string;
    tags?: string[]; // Optional, based on your Schema entity
  }
  
  export interface DataTable {
    idTable: number;
    name: string;
    description: string;
    source:string;
    creationDate: string | Date; // Depending on how you handle dates
    size: number;
    creator: string;
    schemas: Schema[]; // Assuming a one-to-many relationship
  }
  