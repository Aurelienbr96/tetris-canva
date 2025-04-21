export interface DomainEvent {
  readonly type:
    | "PieceCollisionDetected"
    | "CompletedRowEvent"
    | "startGame"
    | "pauseGame";
}

export class CollisionEvent implements DomainEvent {
  type = "PieceCollisionDetected" as const;
}
