import { SagaContextMediator } from './saga-context-mediator';

export class Step<T extends object = null> {
  private invocation: (
    sagaContextMediator: SagaContextMediator<T>,
  ) => void | Promise<void>;
  private compensation: (
    sagaContextMediator: SagaContextMediator<T>,
  ) => void | Promise<void>;
  private readonly name: string;
  private key: string;

  constructor(name = '') {
    this.name = name;
  }

  public setInvocation(
    method: (
      sagaContextWrapper: SagaContextMediator<T>,
    ) => Promise<void> | void,
  ): void {
    this.invocation = method;
  }

  public setCompensation(
    method: (
      sagaContextWrapper: SagaContextMediator<T>,
    ) => Promise<void> | void,
  ): void {
    this.compensation = method;
  }

  public setKey(key: string) {
    this.key = key;
  }

  public getKey() {
    return this.key;
  }

  public async invoke(
    sagaContextWrapper: SagaContextMediator<T>,
  ): Promise<void> {
    if (this.invocation) {
      return this.invocation(sagaContextWrapper);
    }
  }

  public async compensate(
    sagaContextWrapper: SagaContextMediator<T>,
  ): Promise<void> {
    if (this.compensation) {
      return this.compensation(sagaContextWrapper);
    }
  }

  public getName() {
    return this.name;
  }
}
