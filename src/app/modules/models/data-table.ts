export interface DataTable {
    idTable: number;
    name: string; // Holds the file name without the extension
    source: string; // File name with extension
    fileType: string; // 'csv' or 'excel'
    description?: string; // Optional description of the file
    creationDate: string; // Assuming ISO format date string
    modificationDate:string;
    size: number; // File size
    creator: string; // Name of the creator
    schemas: Schema[]; // Assuming a one-to-many relationship
    archived: boolean;
  }
  export interface Schema {
    idSchema?: number;
    name: string;
    type: string;
    description: string;
    tags?: string[]; // Optional, based on your Schema entity
  }