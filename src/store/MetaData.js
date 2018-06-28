// @flow
import { observable, action } from 'mobx';

export type metadataType = {
  minParserVersion: string
};

class MetaData {
  @observable minParserVersion: $PropertyType<metadataType, 'minParserVersion'> = '1.0.0';

  @action setMetaData(metadata: metadataType) {
    this.minParserVersion = metadata.minParserVersion;
  }
}
export default new MetaData();
