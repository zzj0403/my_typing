import quanPinSchema, { type as quanpinType } from './Quanpin'

import type { Quanpin } from '../../Pinyin'

export interface BaseSchemaConfig {
  type: string
  displayName: string
}

export interface QuanpinSchemaConfig extends BaseSchemaConfig {
  map: {
    [key in Quanpin]: string
  }
}

export default class PinyinSchemaRegister {
  public quanPinSchema = quanPinSchema

  public getPinyin(_schemaType: string, quanpin: string) {
    // 仅支持全拼，直接返回
    return quanpin
  }

  public getQuanPinSchema() {
    return this.quanPinSchema
  }

  public getSchemaOptions() {
    return [{
      type: this.quanPinSchema.type,
      displayName: this.quanPinSchema.displayName,
    }]
  }
}
