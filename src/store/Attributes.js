// @flow
import { observable, action } from 'mobx';

type dataListType = Array < {
  data : string,
  code ? : string,
  desc ? : string
} >;

type dataStepType = {
  dataType : 'Integer' | 'Double',
  step : string,
  minValue : string,
  maxValue : string,
  transform ? : {
    k: string,
    c: string
  },
  fallback ? : string
};

type dataTimeType = {
  format: string,
  minHour: number,
  maxHour: number,
  minMinute: number,
  maxMinute: number,
  minSecond: number,
  maxSecond: number
};

type dataDateType = {
  format : string,
  beginDate : string,
  endDate : string
};

type valueRangeType = {
  type: string,
  dataList ? : dataListType,
  dataStep ? : dataStepType,
  dataTime ? : dataTimeType,
  dataDate ? : dataDateType
};

export type attributeType = {
  id: number,
  name: string,
  code ? : Array<string> ,
  desc ? : string,
  defaultValue ? : string,
  readable : boolean,
  writable : boolean,
  valueRange : valueRangeType,
  operationType ? : 'I' | 'G' | 'IG'
};

class Attributes {
  id: number = 1
  @observable attributes: Array<attributeType> = [];

  getAttributes(): any {
    // $FlowFixMe
    return this.attributes.slice();
  }

  getAttributeByName(name: string): attributeType | null {
    const attributesList = this.getAttributes();
    for (let i = 0; i < attributesList.length; i++) {
      const item = attributesList[i];
      if (item.name === name) {
        return item;
      }
    }
    return null;
  }

  // @action addAttribute(attribute: attributeType): void {
  //   this.attributes.push(attribute);
  // }

  @action addOrUpdateAttribute(attribute: attributeType): void {
    let updateFlag = false;
    const attributesList = this.getAttributes();
    for (let i = 0; i < attributesList.length; i++) {
      const item = attributesList[i];
      if (item.id === attribute.id) {
        // this.attributes[i] = {...attribute};
        // $FlowFixMe
        this.attributes.splice(i, 1, attribute);
        updateFlag = true;
        break;
      }
    }
    if (!updateFlag) {
      this.attributes.push({...attribute, id: this.id});
      this.id ++;
    }
  }

  @action removeAttributeByName(name: string): void {
    const attributesList = this.getAttributes();
    for (let i = 0; i < attributesList.length; i++) {
      const item = attributesList[i];
      if (item.name === name) {
        // $FlowFixMe
        this.attributes.remove(item);
      }
    }
  }

 @action removeAttributesByNameList(nameList: Array<string>): void {
    for (let j = 0; j < nameList.length; j++) {
      const name = nameList[j];
      this.removeAttributeByName(name);
    }
  }

  @action removeAll(): void {
    this.attributes.clear();
    this.id = 1;
  }
}

export default new Attributes();
