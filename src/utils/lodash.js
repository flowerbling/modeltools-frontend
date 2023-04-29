import _ from 'lodash'

export default class Lodash {
  static isNull = (value) => {
    return _.isNull(value) || _.isUndefined(value)
  }
}
