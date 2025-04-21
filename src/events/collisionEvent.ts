export interface DomainEvent {
  readonly type: "PieceCollisionDetected" | "CompletedRowEvent";
}

export class CollisionEvent implements DomainEvent {
  type = "PieceCollisionDetected" as const;
}
