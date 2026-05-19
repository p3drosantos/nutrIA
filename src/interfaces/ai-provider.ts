export interface IAIProvider {
  generate<T>(prompt: string): Promise<T>;
}
