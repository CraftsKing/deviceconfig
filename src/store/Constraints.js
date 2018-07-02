// @flow
import { observable, action } from 'mobx';

type pendingConditionType = {
  operator: string,
  commands: any,
};

type additionalCommandsType = {
  mergeType: 'REPLACE' | 'PREPEND' | 'APPEND',
  commands: Array<any>,
};

export type constraintType = {
  id: number,
  pendingCondition: pendingConditionType,
  additionalCommands: additionalCommandsType,
};

class Constraints {
  id: number = 1
  @observable constraints: Array<constraintType> = [];

  getConstraints(): any {
    // $FlowFixMe
    return this.constraints.slice();
  }

  getConstraintsByName(name: string): constraintType | null {
    const constraintsList = this.getConstraints();
    for (let i = 0; i < constraintsList.length; i++) {
      const item = constraintsList[i];
      if (item.name === name) {
        return item;
      }
    }
    return null;
  }

  @action addOrUpdateConstraint(constraint: constraintType): void {
    let updateFlag = false;
    const constraintsList = this.getConstraints();
    for (let i = 0; i < constraintsList.length; i++) {
      const item = constraintsList[i];
      if (item.id === constraint.id) {
        // this.constraints[i] = {...constraint};
        // $FlowFixMe
        this.constraints.splice(i, 1, constraint);
        updateFlag = true;
        break;
      }
    }
    if (!updateFlag) {
      this.constraints.push({...constraint, id: this.id});
      this.id ++;
    }
  }

  @action removeConstraintByName(name: string): void {
    const constraintsList = this.getConstraints();
    for (let i = 0; i < constraintsList.length; i++) {
      const item = constraintsList[i];
      if (item.name === name) {
        // $FlowFixMe
        this.constraints.remove(item);
      }
    }
  }

 @action removeConstraintsByNameList(nameList: Array<string>): void {
    for (let j = 0; j < nameList.length; j++) {
      const name = nameList[j];
      this.removeConstraintByName(name);
    }
  }
    
  @action removeAll(): void {
    // $FlowFixMe
    this.constraints.clear();
    this.id = 1;
  }
}

export default new Constraints();
