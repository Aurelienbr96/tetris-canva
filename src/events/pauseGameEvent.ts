import { DomainEvent } from "./collisionEvent";

export class PauseGameEvent implements DomainEvent {
  type = "pauseGame" as const;
}
