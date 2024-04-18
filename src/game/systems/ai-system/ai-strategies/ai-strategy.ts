export interface AIStrategy {
  update(deltaTime: number): void;
  destroy(): void;
}
