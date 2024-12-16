import { Step } from './step';

export class SagaFlow<T> {
  private readonly steps: Step<T>[];
  private compensationSteps: Step<T>[] = [];

  constructor(steps: Step<T>[] = []) {
    this.steps = steps;
  }

  async invoke(): Promise<void> {
    for (const step of this.steps) {
      this.compensationSteps.push(step);
      await step.invoke();
    }
  }

  async compensate(): Promise<void> {
    for (const step of this.compensationSteps.reverse()) {
      await step.compensate();
    }
  }
}
