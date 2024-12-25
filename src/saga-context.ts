import { Step } from './step';

export class SagaContext<T extends object = null> {
  private currentStepIndex = -1;
  private disabledSteps = new Set();

  constructor(
    private readonly steps: Step<T>[] = [],
    private _context: T = null,
  ) {}

  public set context(ctx: T) {
    this._context = ctx;
  }

  public get context() {
    return this._context;
  }

  public set currentStep(index: number) {
    this.currentStepIndex = index;
  }

  public get currentStep() {
    return this.currentStepIndex;
  }

  public disableStep(key: string) {
    this.disabledSteps.add(key);
  }

  public enableStep(key: string) {
    this.disabledSteps.delete(key);
  }

  public isStepDisabled(key: string) {
    return this.disabledSteps.has(key);
  }
}
