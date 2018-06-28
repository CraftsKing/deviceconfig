// @flow
import { observable, action } from 'mobx';

type triggerType = {
  operator: string,
  conditions: any,
  alarms: Array<string>
};

type actionType = {
  name: string,
  rewriteFields: string,
  defaultValue: string,
  writable: boolean,
  valueRange: any
};

export type modifierType = {
  id: number,
  priority?: number,
  trigger: triggerType,
  actions: Array<actionType>
};

class Modifiers {
  id: number = 1
  @observable modifiers: Array<modifierType> = [];

  getModifiers(): any {
    // $FlowFixMe
    return this.modifiers.slice();
  }

  getModifiersByName(name: string): modifierType | null {
    const modifiersList = this.getModifiers();
    for (let i = 0; i < modifiersList.length; i++) {
      const item = modifiersList[i];
      if (item.name === name) {
        return item;
      }
    }
    return null;
  }

  @action addOrUpdateModifier(modifier: modifierType): void {
    let updateFlag = false;
    const modifiersList = this.getModifiers();
    for (let i = 0; i < modifiersList.length; i++) {
      const item = modifiersList[i];
      if (item.id === modifier.id) {
        // this.modifiers[i] = {...modifier};
        // $FlowFixMe
        this.modifiers.splice(i, 1, modifier);
        updateFlag = true;
        break;
      }
    }
    if (!updateFlag) {
      this.modifiers.push({...modifier, id: this.id});
      this.id ++;
    }
  }

  @action removeModifierByName(name: string): void {
    const modifiersList = this.getModifiers();
    for (let i = 0; i < modifiersList.length; i++) {
      const item = modifiersList[i];
      if (item.name === name) {
        // $FlowFixMe
        this.modifiers.remove(item);
      }
    }
  }

 @action removeModifiersByNameList(nameList: Array<string>): void {
    for (let j = 0; j < nameList.length; j++) {
      const name = nameList[j];
      this.removeModifierByName(name);
    }
  }
}

export default new Modifiers();
