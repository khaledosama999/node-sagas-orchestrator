import { SagaBuilder } from '../saga-builder';
import { Saga } from '../saga';

describe('SagaBuilder', () => {
  let sagaBuilder: SagaBuilder<{ key: string }>;

  beforeEach(() => {
    sagaBuilder = new SagaBuilder<{ key: string }>();
  });

  it('should build saga', () => {
    const saga = sagaBuilder.build();

    expect(saga).toBeInstanceOf(Saga);
  });

  it('should return builder instance on step', () => {
    const builder = sagaBuilder.step();

    expect(builder).toBeInstanceOf(SagaBuilder);
  });

  it('should return builder instance on invoke', () => {
    const builder = sagaBuilder.step().invoke(() => {
      Promise.resolve()
    });

    expect(builder).toBeInstanceOf(SagaBuilder);
  });

  it('should return builder instance with compensation', () => {
    const builder = sagaBuilder
      .step()
      .invoke(() => {
       Promise.resolve()
      })
      .withCompensation(() => {
       Promise.resolve()
      });

    expect(builder).toBeInstanceOf(SagaBuilder);
  });

  it('should return builder instance with key', () => {
    const builder = sagaBuilder
      .step()
      .invoke(() => {
       Promise.resolve()
      })
      .withCompensation(() => {
       Promise.resolve()
      })
      .withKey('key');

    expect(builder).toBeInstanceOf(SagaBuilder);
  });

  it('should return builder instance with context', () => {
    const builder = sagaBuilder.setContext({ key: '1' });

    expect(builder).toBeInstanceOf(SagaBuilder);
  });
});
