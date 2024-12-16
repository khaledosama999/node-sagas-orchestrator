import { Step } from '../step';

describe('Step', () => {
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
    const step = new Step();
    const invocationMethod = jest.fn();
    step.setInvocation(invocationMethod);

    await step.invoke();

    expect(invocationMethod).toHaveBeenCalledWith();
  });

  test('compensation', async () => {
    const step = new Step();
    const compensationMethod = jest.fn();
    step.setCompensation(compensationMethod);

    await step.compensate();

    expect(compensationMethod).toHaveBeenCalledWith();
  });
});
