export type Priority = 'Low' | 'Medium' | 'High';
export type ColumnId = 'Backlog' | 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: Priority;
  columnId: ColumnId;
}
