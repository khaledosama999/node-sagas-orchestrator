import { Saga } from '../saga';
import Factory from '../factory';
import { Step } from '../step';
import { SagaFlow } from '../saga-flow';
import { SagaContext } from '../saga-context';

describe('Saga factory', () => {
  test('createSaga', () => {
    const sagaFactory = new Factory<{ key: string }>();
    const ctx = new SagaContext<{ key: string }>([], { key: '1' });

    expect(sagaFactory.createSaga([], ctx)).toBeInstanceOf(Saga);
  });

  test('createStep', () => {
    const sagaFactory = new Factory();

    expect(sagaFactory.createStep()).toBeInstanceOf(Step);
  });

  test('createSagaFlow', () => {
    const sagaFactory = new Factory();
    const ctx = new SagaContext<{ key: string }>([], { key: '1' });

    expect(sagaFactory.createSagaFlow([], ctx)).toBeInstanceOf(SagaFlow);
  });
});
