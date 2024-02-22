export interface IParsedEvent {
  title: string;
  description: string;
  url: string[];
}

export interface IEventResponse {
  tags: EventTags[];
  events: IParsedEvent[];
}

export type EventTags = "WeeklyAgenda" | "FoodActivities";
