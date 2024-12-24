import { SagaContext } from '../saga-context';

describe('saga context', () => {
  let sagaCtx: SagaContext;

  beforeEach(() => {
    sagaCtx = new SagaContext([]);
  });

  it('it sets current step', () => {
    sagaCtx.currentStep = 1;
    const currentStep = sagaCtx.currentStep;

    expect(currentStep).toEqual(1);
  });

  it('disables steps', () => {
    const key = 'key';

    sagaCtx.disableStep(key);

    expect(sagaCtx.isStepDisabled(key)).toBeTruthy();
  });

  it('re-enables steps', () => {
    const key = 'key';
    sagaCtx.disableStep(key);
    sagaCtx.enableStep(key);

    expect(sagaCtx.isStepDisabled(key)).toBeFalsy();
  });
});
