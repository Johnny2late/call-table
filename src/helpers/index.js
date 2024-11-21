export function isValidDate(value) {
  const date = new Date(value)

  if (isNaN(date.getTime())) {
    return false
  }

  const now = new Date()
  if (date > now) {
    return false
  }
  return true
}

export function formatToTime(dateTimeString) {
  const date = new Date(dateTimeString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  } else {
    return `${minutes}:${String(seconds).padStart(2, '0')}`
  }
}

export function formatDate(dateString) {
  const today = new Date()
  const date = new Date(dateString)

  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (date.toDateString() === yesterday.toDateString()) {
    return 'Вчера'
  }

  if (date.toDateString() === today.toDateString()) {
    return 'Сегодня'
  }

  return date.toLocaleDateString('ru-RU')
}

export function getDateOneWeekAgo() {
  const today = new Date()
  today.setDate(today.getDate() - 7)
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getDateThreeDaysAgo() {
  const today = new Date()
  today.setDate(today.getDate() - 3)
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const debounce = (func, delay) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), delay)
  }
}

export const groupByDate = arr => {
  return arr.reduce((acc, item) => {
    const formattedDate = formatDate(item.date)

    if (!acc[formattedDate]) {
      acc[formattedDate] = []
    }
    acc[formattedDate].push(item)

    return acc
  }, {})
}
