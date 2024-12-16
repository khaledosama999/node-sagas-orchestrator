import { Step } from "./step";

export class SagaContext<T> {
    constructor(private readonly steps: Step<T>[]) {}
}