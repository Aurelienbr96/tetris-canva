import { DomainEvent } from "./collisionEvent";

export class StartGameEvent implements DomainEvent {
  type = "startGame" as const;
}
