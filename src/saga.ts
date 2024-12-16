import { SagaFlow } from './saga-flow';
import { SagaCompensationFailed, SagaExecutionFailed } from './exceptions';

export enum SagaStates {
  New = 'New',
  InProgress = 'In progress',
  InCompensation = 'In compensation',
  Complete = 'Complete',
  CompensationComplete = 'Compensation complete',
  CompensationError = 'Compensation error',
}

export class Saga<T> {
  private sagaFlow: SagaFlow<T>;

  private state: string;
  private invokeError: Error;
  private compensationError: Error;

  constructor(sagaFlow: SagaFlow<T>) {
    this.sagaFlow = sagaFlow;
    this.state = SagaStates.New;
  }

  public getState(): string {
    return this.state;
  }

  public async execute(): Promise<void> {
    this.state = SagaStates.InProgress;
    try {
      await this.sagaFlow.invoke();
      this.state = SagaStates.Complete;

    } catch (e) {
      this.state = SagaStates.InCompensation;
      this.invokeError = e;
      await this.runCompensationFlow();
      throw new SagaExecutionFailed(e);
    }
  }

  private async runCompensationFlow(): Promise<void> {
    try {
      await this.sagaFlow.compensate();
      this.state = SagaStates.CompensationComplete;
    } catch (e) {
      this.state = SagaStates.CompensationError;
      this.compensationError = e;
      throw new SagaCompensationFailed(e);
    }
  }
}
