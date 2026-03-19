export interface StudyPlan {
  id: number;
  title: string;
  subject: string;
  goal: string;
  duration: string;
  content: string;
  created_at: string;
}

export interface PlanFormData {
  title: string;
  subject: string;
  goal: string;
  duration: string;
}
