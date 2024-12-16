import { SagaContext } from "./saga-context";

export class Step<T> {
  private invocation: Function;
  private compensation: Function;
  private readonly name: string;

  constructor(name = '') {
    this.name = name;
  }

  public setInvocation(method: () => Promise<void> | void): void {
    this.invocation = method;
  }

  public setCompensation(method: () => Promise<void> | void): void {
    this.compensation = method;
  }

  public async invoke(): Promise<void> {
    if (this.invocation) {
      return this.invocation();
    }
  }

  public async compensate(): Promise<void> {
    if (this.compensation) {
      return this.compensation();
    }
  }

  public getName() {
    return this.name;
  }
}
