import { Saga, SagaStates } from '../saga';
import { SagaFlow } from '../saga-flow';
import { SagaCompensationFailed, SagaExecutionFailed } from '../exceptions';

const expectSagaFlowMethod = (sagaFlowMethod) => {
  expect(sagaFlowMethod).toHaveBeenCalledTimes(1);
};

describe('Saga', () => {
  let sagaFlow;
  let saga;

  beforeEach(() => {
    sagaFlow = new SagaFlow();
    saga = new Saga(sagaFlow);
  });

  test('construct', () => {
    expect(saga).toBeInstanceOf(Saga);
    expect(saga.getState()).toBe(SagaStates.New);
  });

  test('execute with empty steps', () => {
    expect(async () => await saga.execute({})).not.toThrow();
  });

  test('execute with positive flow', async () => {
    sagaFlow.invoke = jest.fn();
    sagaFlow.compensate = jest.fn();

    const sagaPromise = saga.execute();
    expect(saga.getState()).toBe(SagaStates.InProgress);
    await sagaPromise;

    expect(saga.getState()).toBe(SagaStates.Complete);
    expectSagaFlowMethod(sagaFlow.invoke);
    expect(sagaFlow.compensate).not.toHaveBeenCalled();
  });

  test('execute with compensation flow', async () => {
    const sagaFlow = new SagaFlow();
    sagaFlow.invoke = jest.fn(() => Promise.reject(new Error()));
    sagaFlow.compensate = jest.fn();
    const saga = new Saga(sagaFlow);

    await expect(saga.execute()).rejects.toThrow(SagaExecutionFailed);

    expect(saga.getState()).toBe(SagaStates.CompensationComplete);
    expectSagaFlowMethod(sagaFlow.invoke);
    expectSagaFlowMethod(sagaFlow.compensate);
  });

  test('execute with compensation flow error', async () => {
    sagaFlow.invoke = jest.fn(() => Promise.reject(new Error()));
    sagaFlow.compensate = jest.fn(() => Promise.reject(new Error()));

    await expect(saga.execute()).rejects.toThrow(
      SagaCompensationFailed,
    );

    expect(saga.getState()).toBe(SagaStates.CompensationError);
    expectSagaFlowMethod(sagaFlow.invoke);
    expectSagaFlowMethod(sagaFlow.compensate);
  });
});
