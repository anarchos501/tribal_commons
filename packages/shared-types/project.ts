export interface Project {
  id: number;
  title: string;
  status: "proposal" | "active" | "completed" | "archived";
}