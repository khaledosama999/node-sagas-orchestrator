import { SagaBuilder } from '../saga-builder';
import { SagaStates } from '../saga';
import { SagaExecutionFailed } from '../exceptions';

const fakeInvoke1 = jest.fn();
const fakeInvoke2 = jest.fn();
const fakeInvoke3 = jest.fn();
const fakeCompensation = jest.fn();

describe('Saga functionality', () => {
  beforeEach(() => {
    fakeInvoke1.mockClear();
    fakeInvoke2.mockClear();
    fakeInvoke3.mockClear();
    fakeCompensation.mockClear();
  });

  it('should build and execute saga with invocation steps', async () => {
    const sagaBuilder = new SagaBuilder();
    const saga = sagaBuilder
      .step()
      .invoke(fakeInvoke1)
      .step()
      .invoke(fakeInvoke2)
      .step()
      .invoke(fakeInvoke3)
      .build();

    await saga.execute();
    expect(fakeInvoke1).toHaveBeenCalledTimes(1);
    expect(fakeInvoke2).toHaveBeenCalledTimes(1);
    expect(fakeInvoke3).toHaveBeenCalledTimes(1);
    expect(saga.getState()).toBe(SagaStates.Complete);
  });

  it('should build and execute saga with compensation steps', async () => {
    const sagaBuilder = new SagaBuilder();
    const saga = sagaBuilder
      .step()
      .invoke(fakeInvoke1)
      .withCompensation(fakeCompensation)
      .step()
      .invoke(fakeInvoke2)
      .step()
      .invoke(() => {
        throw new Error();
      })
      .build();

    await expect(saga.execute()).rejects.toThrow(SagaExecutionFailed);
    expect(saga.getState()).toBe(SagaStates.CompensationComplete);
    expect(fakeInvoke1).toHaveBeenCalledTimes(1);
    expect(fakeCompensation).toHaveBeenCalledTimes(1);
    expect(fakeInvoke2).toHaveBeenCalledTimes(1);
  });
});
