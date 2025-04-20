export interface DomainEvent {
  readonly type: "PieceCollisionDetected";
}

export class CollisionEvent implements DomainEvent {
  type = "PieceCollisionDetected" as const;
}
