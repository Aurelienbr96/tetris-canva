import { DomainEvent } from "./collisionEvent";

export class CompletedRowEvent implements DomainEvent {
  type = "CompletedRowEvent" as const;
}
