// @flow
import { observable, action } from 'mobx';

export type alarmType = {
  id: number,
  name: string,
  code ? : string,
  desc ? : string,
  clear ? : boolean
};

class Alarms {
  id: number = 1
  @observable alarms: Array<alarmType> = [];

  getAlarms(): any {
    // $FlowFixMe
    return this.alarms.slice();
  }

  getAlarmsByName(name: string): alarmType | null {
    const alarmsList = this.getAlarms();
    for (let i = 0; i < alarmsList.length; i++) {
      const item = alarmsList[i];
      if (item.name === name) {
        return item;
      }
    }
    return null;
  }

  @action addOrUpdateAlarm(alarm: alarmType): void {
    let updateFlag = false;
    const alarmsList = this.getAlarms();
    for (let i = 0; i < alarmsList.length; i++) {
      const item = alarmsList[i];
      if (item.id === alarm.id) {
        // this.alarms[i] = {...alarm};
        // $FlowFixMe
        this.alarms.splice(i, 1, alarm);
        updateFlag = true;
        break;
      }
    }
    if (!updateFlag) {
      this.alarms.push({...alarm, id: this.id});
      this.id ++;
    }
  }

  @action removeAlarmByName(name: string): void {
    const alarmsList = this.getAlarms();
    for (let i = 0; i < alarmsList.length; i++) {
      const item = alarmsList[i];
      if (item.name === name) {
        // $FlowFixMe
        this.alarms.remove(item);
      }
    }
  }

 @action removeAlarmsByNameList(nameList: Array<string>): void {
    for (let j = 0; j < nameList.length; j++) {
      const name = nameList[j];
      this.removeAlarmByName(name);
    }
  }
}

export default new Alarms();
