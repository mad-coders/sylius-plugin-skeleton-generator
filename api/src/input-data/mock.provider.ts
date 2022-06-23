import { InputDataMockService } from "../input-data/mock.service";

export const MockInputDataServiceProvider = {
    provide: 'input.data.service',
    useClass: InputDataMockService,
};
