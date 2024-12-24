import { Step } from './step';
import { Saga } from './saga';
import Factory from './factory';
import { SagaContext } from './saga-context';
import { SagaContextMediator } from './saga-context-mediator';

export class SagaBuilder<T extends {} = null> {
  private currentStep: Step<T>;
  private steps: Step<T>[] = [];
  private factory = new Factory<T>();
  private context: T;

  public setFactory(factory: Factory<T>) {
    this.factory = factory;
  }

  public step(name = '') {
    this.currentStep = this.factory.createStep(name);
    this.steps.push(this.currentStep);
    return this;
  }

  public invoke(method: (sagaContextMediator :SagaContextMediator<T>) => Promise<void> | void): this {
    this.currentStep.setInvocation(method);
    return this;
  }

  public withCompensation(method: (sagaContextMediator :SagaContextMediator<T>) => Promise<void> | void): this {
    this.currentStep.setCompensation(method);
    return this;
  }

  public withKey(key: string) {
    this.currentStep.setKey(key);
    return this;
  }

  public setContext(ctx: T) {
    this.context = ctx;
    return this;
  }

  public build(): Saga<T> {
    const ctx = new SagaContext(this.steps, this.context);
    return this.factory.createSaga(this.steps, ctx);
  }
}
