export interface ITodoCreateInput {
  title: string;
  description: string;
  date: string;
  completed?: boolean;
}

export interface ITodoResponse {
  id: number;
  title: string;
  description: string;
  date: Date;
  completed: boolean;
}
