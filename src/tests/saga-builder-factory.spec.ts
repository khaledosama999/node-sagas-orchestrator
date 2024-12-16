import { SagaBuilderFactory } from "../saga-builder-factory";
import { SagaBuilder } from "../saga-builder";

describe('Saga builder factory', () => {
  test('createSaga', () => {
    const sagaBuilderFactory = new SagaBuilderFactory();

    expect(sagaBuilderFactory.createBuilder()).toBeInstanceOf(SagaBuilder);
  });
});
