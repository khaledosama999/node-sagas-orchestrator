import { SagaContext } from './saga-context';
import { SagaContextMediator } from './saga-context-mediator';
import { Step } from './step';

export class SagaFlow<T extends object= null> {
  private readonly steps: Step<T>[];
  private compensationSteps: Step<T>[] = [];
  private context: SagaContext<T>;
  private sagaContextMediator: SagaContextMediator<T>;

  constructor(steps: Step<T>[] = [], ctx: SagaContext<T> = new SagaContext()) {
    this.steps = steps;
    this.context = ctx;

    this.sagaContextMediator = new SagaContextMediator(this.context);
  }

  async invoke(): Promise<void> {
    for (const step of this.steps) {
      if (!this.context.isStepDisabled(step.getKey())) {
        this.compensationSteps.push(step);
        await step.invoke(this.sagaContextMediator);
      }
    }
  }

  async compensate(): Promise<void> {
    for (const step of this.compensationSteps.reverse()) {
      await step.compensate(this.sagaContextMediator);
    }
  }
}
