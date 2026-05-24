export interface Project {
  id: number;
  tribeId: number;
  title: string;
  status: "proposal" | "active" | "completed" | "archived";
}