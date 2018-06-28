// @flow
import { observable, action } from 'mobx';

type accessWayType = 1 | 2 | 3 | 5;
export type baseInfoType = {
  specVersion ? : string,
  deviceIdType ? : number,
  deviceType ? : string,
  uPlusId: string,
  model: {
    'number': string,
    name: string,
    label: string,
    description: string
  },
  manufacturer : {
    name: string,
    fullName: string,
    shortName: string,
    label: string,
    description: string
  },
  accessWay ? : accessWayType,
  standardCode: boolean
};
// type PropbaseInfoType = $Values<baseInfoType>;

class BaseInfo {
  @observable specVersion: $PropertyType<baseInfoType, 'specVersion'>;
  @observable deviceIdType: $PropertyType<baseInfoType, 'deviceIdType'>;
  @observable deviceType: $PropertyType<baseInfoType, 'deviceType'>;
  @observable uPlusId: $PropertyType<baseInfoType, 'uPlusId'> = '';
  @observable model: $PropertyType<baseInfoType, 'model'> = {
  	number: 'null',
    name: '',
    label: '',
    description: ''
  };
  @observable manufacturer: $PropertyType<baseInfoType, 'manufacturer'> = {
    name: '',
  	fullName: '',
    shortName: '',
    label: '',
    description: ''
  };
  @observable accessWay: $PropertyType<baseInfoType, 'accessWay'>;
  @observable standardCode: $PropertyType<baseInfoType, 'standardCode'> = true;

  @action setBaseInfo(baseInfo: baseInfoType) {
    this.specVersion = baseInfo.specVersion;
    this.deviceIdType = baseInfo.deviceIdType;
    this.deviceType = baseInfo.deviceType;
    this.uPlusId = baseInfo.uPlusId;
    this.model = baseInfo.model;
    this.manufacturer = baseInfo.manufacturer;
    this.accessWay = baseInfo.accessWay;
    this.standardCode = baseInfo.standardCode;
  }
}
export default new BaseInfo();
