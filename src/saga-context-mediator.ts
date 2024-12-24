import { SagaContext } from './saga-context';

export class SagaContextMediator<T extends {} = null> {
  constructor(private readonly sagaContext: SagaContext<T>) {}

  /**
   * Disable step given it's key
   * 
   * @param key 
   * @returns 
   */
  public disableStep(key: string) {
    return this.sagaContext.disableStep(key);
  }

  /**
   * Re-enables the step by it's given key
   * @param key 
   * @returns 
   */
  public enableStep(key: string) {
    return this.sagaContext.enableStep(key);
  }

  public isStepDisable(key: string) {
    return this.sagaContext.isStepDisabled(key);
  }

  /**
   * Returns the current context value
   * 
   * @returns 
   */
  public getContext() {
    return this.sagaContext.context;
  }

  /**
   * Overwrites the context with the provided context
   * 
   * @param context 
   * @returns 
   */
  public setContext(context: T) {
    return (this.sagaContext.context = context);
  }
}
