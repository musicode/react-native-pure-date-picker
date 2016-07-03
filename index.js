'use strict'

import React, {
  Component,
  PropTypes,
} from 'react'

import {
  View,
  Text,
} from 'react-native'

import Picker from 'react-native-picker'

function isLeapYear(year) {
  // 四年一闰，百年不闰，四百年再闰
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

function createList(start, end) {
  let result = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}

function createDate(year, month) {
  let length = 30
  if (month === 2) {
    length = isLeapYear(year) ? 29 : 28
  }
  else {
    let map = {
      1: 1,
      3: 1,
      5: 1,
      7: 1,
      8: 1,
      10: 1,
      12: 1,
    }
    if (map[month]) {
      length = 31
    }
  }
  return createList(1, length)
}

function createMonth() {
  return createList(1, 12)
}

function createYear(options) {

  let {
    start,
    end,
    sofar,
    hasMonth,
    hasDate,
    formatYear,
    formatMonth,
    formatDate,
  } = options

  if (!end && sofar) {
    end = (new Date()).getFullYear()
  }

  let years = createList(start, end)
  if (sofar) {
    years.push(sofar)
  }

  let formatDefault = text => text

  if (!formatYear) {
    formatYear = formatDefault
  }
  if (!formatMonth) {
    formatMonth = formatDefault
  }
  if (!formatDate) {
    formatDate = formatDefault
  }

  if (!hasMonth && !hasDate) {
    return years.map(formatYear)
  }

  let yearData = { }
  if (hasMonth) {
    years.forEach(year => {
      let isValidYear = year >= start && year <= end
      let monthData
      let months = isValidYear ? createMonth() : ['']
      if (hasDate) {
        monthData = { }
        months.forEach(month => {
          let isValidMonth = typeof month === 'number'
          monthData[formatMonth(month)] =
            isValidYear && isValidMonth
            ? createDate(year, month).map(formatDate)
            : ['']
        })
      }
      else {
        monthData = months.map(formatMonth)
      }
      yearData[formatYear(year)] = monthData
    })
  }

  return yearData

}


export default class DatePicker extends Component {

  static propTypes = {
    startYear: PropTypes.number,
    endYear: PropTypes.number,
    sofar: PropTypes.any,
    hasMonth: PropTypes.bool,
    hasDate: PropTypes.bool,
    value: PropTypes.array.isRequired,

    height: PropTypes.number,
    showDuration: PropTypes.number,
    showMask: PropTypes.bool,
    submitText: PropTypes.string,
    cancelText: PropTypes.string,

    headerStyle: View.propTypes.style,
    headerButtonStyle: Text.propTypes.style,

    elevation: Picker.propTypes.pickerElevation,
    formatYear: PropTypes.func,
    formatMonth: PropTypes.func,
    formatDate: PropTypes.func,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    height: 260,
    showDuration: 300,
    hasMonth: true,
    showMask: true,
    submitText: '完成',
    cancelText: '取消',
    formatYear: year => typeof year === 'number' ? (year + '年') : year,
    formatMonth: month => typeof month === 'number' ? (month + '月') : month,
    formatDate: date => typeof date === 'number' ? (date + '日') : date,
    headerStyle: {
      backgroundColor: '#F8F8F8',
      paddingVertical: 10,
      height: 40,
    }
  }

  toggle() {
    this.refs.picker.toggle()
  }

  show() {
    this.refs.picker.show()
  }

  hide() {
    this.refs.picker.hide()
  }

  isHidden() {
    return !this.refs.picker.isPickerShow()
  }

  render() {

    let {
      startYear,
      endYear,
      sofar,
      hasMonth,
      hasDate,
      value,

      height,
      showDuration,
      showMask,
      submitText,
      cancelText,

      headerStyle,
      headerButtonStyle,
      elevation,

      formatYear,
      formatMonth,
      formatDate,
      onSubmit,
      onCancel,
      onChange,
    } = this.props

    return (
      <Picker
        ref="picker"
        selectedValue={value}
        pickerData={createYear({
          start: startYear,
          end: endYear,
          sofar,
          hasMonth,
          hasDate,
          formatYear,
          formatMonth,
          formatDate,
        })}
        style={{height}}
        showDuration={showDuration}
        pickerBtnText={submitText}
        pickerCancelBtnText={cancelText}
        showMask={showMask}
        pickerToolBarStyle={headerStyle}
        pickerBtnStyle={headerButtonStyle}
        pickerElevation={elevation}
        onPickerDone={onSubmit}
        onPickerCancel={onCancel}
        onValueChange={onChange}
      />
    )
  }
}
