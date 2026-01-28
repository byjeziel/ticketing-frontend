export type ScheduleItem = {
  date: string;
  time: string;
  tickets: number;
};

export type EventEntity = {
  _id?: string;
  title: string;
  description: string;
  schedule: ScheduleItem[];
};