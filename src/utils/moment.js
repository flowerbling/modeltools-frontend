import Lodash from './lodash'
import moment from 'moment'
export default class Moment {
  static formatGMTISO8601Date = (date) => {
    if (Lodash.isNull(date)) {
      return ''
    }
    return moment(date).toISOString()
  }

  static parseGMTISO8601Date = (dateString, layout) => {
    const parseLayout = layout || 'YYYY-MM-DD HH:mm'
    return moment(dateString).format(parseLayout)
  }

  static getBeautyDate = (date) => {
    let dateStr = new Date(date)
    let today = new Date()
    let hour = today.getHours()
    let minute = today.getMinutes()
    let second = today.getSeconds()
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)
    let otime = today.getTime()
    // 给出时间 - 今天0点
    let offset = dateStr.getTime() - otime
    let isToday = offset / 1000 / 60 / 60
    if (isToday > 0 && isToday <= 24) {
      return '今天 ' + hour + ':' + minute + ':' + second
    } else if (isToday < 0 && isToday >= -24) {
      return '昨天 ' + hour + ':' + minute + ':' + second
    } else {
      return Moment.parseGMTISO8601Date(date)
    }
  }
}
