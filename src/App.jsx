import React, { useCallback, useEffect, useState, useRef } from 'react'

import { Select } from './components/select'
import TableRow from './components/tableRow'

import { fetchList } from './api'
import {
  getDateThreeDaysAgo,
  getDateOneWeekAgo,
  getTodayDate,
  groupByDate,
  debounce,
} from './helpers'

import ArrowSelect from './assets/svg/arrowSelect'
import logo from './assets/img/mini-logo.png'
import Close from './assets/svg/close'

import './App.css'

const listType = [
  { id: 1, value: 'Все типы', type: '' },
  { id: 2, value: 'Входящие', type: '1' },
  { id: 3, value: 'Исходящие', type: '0' },
]

const listTimeSlots = [
  {
    id: 1,
    value: '3 Дня',
    disabled: false,
    slot: { from: getDateThreeDaysAgo(), to: getTodayDate() },
  },
  {
    id: 2,
    value: 'Неделя',
    disabled: false,
    slot: { from: getDateOneWeekAgo(), to: getTodayDate() },
  },
  { id: 3, value: 'Месяц', disabled: true },
  { id: 4, value: 'Год', disabled: true },
  { id: 5, value: 'Указать Даты', disabled: false, isDate: true },
]

function App() {
  const tableBodyRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [loadMore, setLoadMore] = useState(true)
  const [error, setError] = useState(null)

  const [rows, setRows] = useState(0)
  const [list, setList] = useState([])
  const [sort, setSort] = useState('date') // date || duration
  const [typeCalls, setTypeCalls] = useState('') // '' || 0 || 1
  const [timeSlot, setTimeSlot] = useState({ from: getDateThreeDaysAgo(), to: getTodayDate() })

  const [groupedList, setGroupedList] = useState({})

  const reset = () => {
    setRows(0)
    setList([])
  }

  const loadData = async (getMore = false) => {
    if (list.length && list.length >= rows) {
      return
    }
    getMore ? setLoadMore(true) : setLoading(true)
    setError(null)

    try {
      const offset = list.length ? list.length : 0
      const data = await fetchList(timeSlot.from, timeSlot.to, typeCalls, sort, offset)

      setList(prev => (getMore ? [...prev, ...data.results] : data.results))
      setRows(data.total_rows)
    } catch (err) {
      setError(err)
    } finally {
      setLoadMore(false)
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  const handleSort = useCallback(
    value => {
      if (value !== sort) reset()
      setSort(value)
    },
    [sort, list],
  )

  const handleTimeSlot = useCallback(
    item => {
      if (item.slot.from !== timeSlot.from) reset()
      setTimeSlot(item.slot)
    },
    [timeSlot],
  )

  const handleTypeCalls = useCallback(
    type => {
      if (type !== typeCalls) reset()
      setTypeCalls(type)
    },
    [typeCalls],
  )

  const handleScroll = useCallback(
    debounce(() => {
      const tableBody = tableBodyRef.current

      if (
        tableBody &&
        tableBody.scrollTop + tableBody.clientHeight >= tableBody.scrollHeight - 50 &&
        !loadMore &&
        !loading
      ) {
        loadData(true)
      }
    }, 200),
    [loadMore, loading],
  )

  useEffect(() => {
    const tableBody = tableBodyRef.current

    if (tableBody) {
      tableBody.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (tableBody) {
        tableBody.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  useEffect(() => {
    loadData()
  }, [sort, typeCalls, timeSlot])

  useEffect(() => {
    const groupedData = groupByDate(list)
    setGroupedList(groupedData)
  }, [list])

  return (
    <div className="App">
      {loading && (
        <div className="loading">
          <img src={logo} alt="logo" />
        </div>
      )}

      <header className="header">
        <div className="header-left">
          <Select onChange={el => handleTypeCalls(el.type)} reset={typeCalls} list={listType} />

          {typeCalls !== '' && (
            <div className="header-left-reset" onClick={() => handleTypeCalls('')}>
              Cбросить фильтры <Close width="9" height="9" />
            </div>
          )}
        </div>

        <div className="header-right">
          <Select
            onChange={handleTimeSlot}
            positionDropdown="right"
            type="date"
            list={listTimeSlots}
          />
        </div>
      </header>

      <div className="container">
        <div className="table">
          <div className="table-head">
            <div className="table-head-cl cl--type">Тип</div>

            <div className="table-head-cl cl--time cl--select" onClick={() => handleSort('date')}>
              Время
              <div className={`cl--select-arrow`}>
                <ArrowSelect fill={sort === 'date' ? '#002CFB' : '#ADBFDF'} />
              </div>
            </div>

            <div className="table-head-cl cl--staff">Сотрудник</div>
            <div className="table-head-cl cl--call">Звонок</div>
            <div className="table-head-cl cl--source">Источник</div>
            <div className="table-head-cl cl--score">Оценка</div>

            <div
              className="table-head-cl cl--duration cl--select"
              onClick={() => handleSort('duration')}
            >
              Длительность
              <div className={`cl--select-arrow`}>
                <ArrowSelect fill={sort === 'duration' ? '#002CFB' : '#ADBFDF'} />
              </div>
            </div>
          </div>

          {error && <div className="error">{error.message}</div>}

          <div className={`table-body${loadMore ? ' table-body--load' : ''}`} ref={tableBodyRef}>
            {list.length > 0 &&
              Object.keys(groupedList).map(date => {
                if (date === 'Сегодня') {
                  return groupedList[date].map(item => <TableRow key={item.id} item={item} />)
                }

                return (
                  <div key={date}>
                    <div className="table-separator">
                      {date} <span>{groupedList[date].length}</span>
                    </div>
                    {groupedList[date].map(item => (
                      <TableRow key={item.id} item={item} />
                    ))}
                  </div>
                )
              })}
          </div>
        </div>

        {loadMore && <div className="loading-more">Загрузка...</div>}
      </div>
    </div>
  )
}

export default App
