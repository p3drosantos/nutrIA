export interface IAIProvider {
  generate<T>(prompt: string, responseSchema?: any): Promise<T>;
}
