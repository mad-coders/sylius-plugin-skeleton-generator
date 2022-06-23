import { InputDataMockService } from "../input-data/mock.service";

export const InputDataServiceProvider = {
    provide: 'input.data.service',
    useClass: InputDataMockService,
};
