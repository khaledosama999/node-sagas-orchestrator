import { Step } from '../step';
import { SagaFlow } from '../saga-flow';

const expectInvokeBehavior = (stepMock) => {
  expect(stepMock.invoke).toHaveBeenCalledTimes(1);
};

const expectStepsBehavior = (stepMock1, stepMock2, ) => {
  expectInvokeBehavior(stepMock1 );
  expect(stepMock1.compensate).toHaveBeenCalledTimes(1);

  expectInvokeBehavior(stepMock2, );
  expect(stepMock2.compensate).toHaveBeenCalledTimes(1);
};

describe('Saga Flow', () => {
  test('construct', () => {
    const sagaFlow = new SagaFlow();

    expect(sagaFlow).toBeInstanceOf(SagaFlow);
  });

  test('invoke with empty steps', async () => {
    const sagaFlow = new SagaFlow();

    await expect(sagaFlow.invoke()).resolves.toBeUndefined();
  });

  test('compensate with empty steps', async () => {
    const sagaFlow = new SagaFlow();

    await expect(sagaFlow.compensate()).resolves.toBeUndefined();
  });

  test('execute with positive flow', async () => {
    const executionOrder: number[] = [];
    const stepMock1 = new Step();
    stepMock1.invoke = jest.fn(async () => {
      executionOrder.push(1);
    });
    const stepMock2 = new Step();
    stepMock2.invoke = jest.fn(async () => {
      executionOrder.push(2);
    });

    const saga = new SagaFlow([stepMock1, stepMock2]);

    await saga.invoke();

    expectInvokeBehavior(stepMock1);
    expectInvokeBehavior(stepMock2);
    expect(executionOrder).toEqual([1, 2]);
  });

  test('execute with compensation flow', async () => {
    const executionOrder: number[] = [];
    const stepMock1 = new Step();
    stepMock1.invoke = jest.fn(async () => {
      executionOrder.push(1);
    });
    stepMock1.compensate = jest.fn(async () => {
      executionOrder.push(4);
    });
    const stepMock2 = new Step();
    stepMock2.invoke = jest.fn(() => {
      executionOrder.push(2);
      return Promise.reject(new Error());
    });
    stepMock2.compensate = jest.fn(async () => {
      executionOrder.push(3);
    });

    const saga = new SagaFlow([stepMock1, stepMock2]);

    await expect(saga.invoke()).rejects.toEqual(new Error());
    await saga.compensate();

    expectStepsBehavior(stepMock1, stepMock2, );
    expect(executionOrder).toEqual([1, 2, 3, 4]);
  });

  test('execute with errors in compensation flow', async () => {
    const executionOrder: number[] = [];
    const stepMock1 = new Step();
    stepMock1.invoke = jest.fn(async () => {
      executionOrder.push(1);
    });
    stepMock1.compensate = jest.fn(() => {
      executionOrder.push(4);
      throw new Error();
    });
    const stepMock2 = new Step();
    stepMock2.invoke = jest.fn(() => {
      executionOrder.push(2);
      throw new Error();
    });
    stepMock2.compensate = jest.fn(async () => {
      executionOrder.push(3);
    });

    const saga = new SagaFlow([stepMock1, stepMock2]);

    await expect(saga.invoke()).rejects.toEqual(new Error());
    await expect(saga.compensate()).rejects.toEqual(new Error());
    expectStepsBehavior(stepMock1, stepMock2, );
    expect(executionOrder).toEqual([1, 2, 3, 4]);
  });
});
