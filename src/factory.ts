import { Step } from './step';
import { SagaFlow } from './saga-flow';
import { Saga } from './saga';
import { SagaContext } from './saga-context';

export default class Factory<T> {
  public createSaga(steps: Step<T>[], ctx: SagaContext<T>): Saga<T> {
    return new Saga<T>(this.createSagaFlow(steps, ctx));
  }

  public createSagaFlow(steps: Step<T>[], ctx: SagaContext<T>): SagaFlow<T> {
    return new SagaFlow<T>(steps, ctx);
  }

  public createStep(name = ''): Step<T> {
    return new Step<T>(name);
  }
}
