// @flow
import { observable, action } from 'mobx';

export type otherType = {
  currentStep: number
};

class Other {
  @observable currentStep: $PropertyType<otherType, 'currentStep'> = 0;

  @action setCurrentStep(currentStep: number) {
    this.currentStep = currentStep;
  }
}
export default new Other();
