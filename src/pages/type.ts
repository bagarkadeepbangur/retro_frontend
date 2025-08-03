// src/types.ts
export interface Card {
    _id:string;
    content: string;
  }
  
  export interface Column {
    name: string;
    cards: Card[];
    color:string;
    _id:string
  }
  
  export interface Board {
    _id: string;
    title: string;
    columns: Column[];
  }
  