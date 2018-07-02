// @flow
import { observable, action } from 'mobx';

export type groupCommandType = {
  id: number,
  name: string,
  code ?: string,
  desc ?: string,
  attrNameList: Array<string>
};

class GroupCommands {
  id: number = 1
  @observable groupCommands: Array<groupCommandType> = []

  getGroupCommands(): any {
    // $FlowFixMe
    return this.groupCommands.slice();
  }

  getGroupCommandsByName(name: string): groupCommandType | null {
    const groupCommandsList = this.getGroupCommands();
    for (let i = 0; i < groupCommandsList.length; i++) {
      const item = groupCommandsList[i];
      if (item.name === name) {
        return item;
      }
    }
    return null;
  }

  @action addOrUpdateGroupCommand(groupCommand: groupCommandType): void {
    let updateFlag = false;
    const groupCommandsList = this.getGroupCommands();
    for (let i = 0; i < groupCommandsList.length; i++) {
      const item = groupCommandsList[i];
      if (item.id === groupCommand.id) {
        // this.groupCommands[i] = {...groupCommand};
        // $FlowFixMe
        this.groupCommands.splice(i, 1, groupCommand);
        updateFlag = true;
        break;
      }
    }
    if (!updateFlag) {
      this.groupCommands.push({...groupCommand, id: this.id});
      this.id ++;
    }
  }

  @action removeGroupCommandByName(name: string): void {
    const groupCommandsList = this.getGroupCommands();
    for (let i = 0; i < groupCommandsList.length; i++) {
      const item = groupCommandsList[i];
      if (item.name === name) {
        // $FlowFixMe
        this.groupCommands.remove(item);
      }
    }
  }

 @action removeGroupCommandsByNameList(nameList: Array<string>): void {
    for (let j = 0; j < nameList.length; j++) {
      const name = nameList[j];
      this.removeGroupCommandByName(name);
    }
  }
      
  @action removeAll(): void {
    // $FlowFixMe
    this.groupCommands.clear();
    this.id = 1;
  }
}

export default new GroupCommands();
