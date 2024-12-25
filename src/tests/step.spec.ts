import { SagaContextMediator } from '../saga-context-mediator';
import { Step } from '../step';
import { SagaContext } from '../saga-context';

describe('Step', () => {
  const mockInitialValue = {
    f1: jest.fn(),
  };

  beforeEach(() => {
    mockInitialValue.f1.mockClear();
  });

  const sagaContextMediator = new SagaContextMediator(
    new SagaContext([], mockInitialValue),
  );

  test('construct', () => {
    const step = new Step();

    expect(step).toBeInstanceOf(Step);
  });

  test('getName', () => {
    const stepName = 'My step';
    const step = new Step(stepName);

    expect(step.getName()).toEqual(stepName);
  });

  test('invoke', async () => {
    const step = new Step<{f1: jest.Mock}>();
    const invocationMethod = (
      sagaContextMediator: SagaContextMediator<{ f1: jest.Mock }>,
    ) => sagaContextMediator.getContext().f1();

    step.setInvocation(invocationMethod);
    await step.invoke(sagaContextMediator);

    expect(mockInitialValue.f1).toHaveBeenCalledTimes(1);
  });

  test('compensation', async () => {
    const step = new Step<{f1: jest.Mock}>();
    const compensationMethod = (
      sagaContextMediator: SagaContextMediator<{ f1: jest.Mock }>,
    ) => sagaContextMediator.getContext().f1();

    step.setCompensation(compensationMethod);

    await step.compensate(sagaContextMediator);

    expect(mockInitialValue.f1).toHaveBeenCalledTimes(1);
  });
});
