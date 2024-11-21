import React, { useEffect, useState } from 'react'

import { formatToTime, formatTime } from '../../helpers'

import CallUp from '../../assets/svg/callUp'
import CallDown from '../../assets/svg/callDown'
import Avatar from '../../assets/svg/avatar'

import Player from '../player'

const TableRow = ({ item }) => {
  const [score, setScore] = useState({ type: '', value: '' })

  const getCallStatus = () => {
    if (item.in_out === 1 && item.status === 'Дозвонился') {
      return <CallUp fill="#002CFB" />
    }
    if (item.in_out === 0 && item.status === 'Дозвонился') {
      return <CallDown fill="#28A879" />
    }
    if (item.in_out === 1 && item.status === 'Не дозвонился') {
      return <CallDown />
    }
    if (item.in_out === 0 && item.status === 'Не дозвонился') {
      return <CallUp />
    }
  }

  useEffect(() => {
    const result = Math.floor(Math.random() * 5)

    switch (result) {
      case 0:
        setScore({ type: 'normal', value: 'Хорошо' })
        break
      case 1:
        setScore({ type: 'bad', value: 'Плохо' })
        break
      case 2:
        setScore({ type: 'noscript', value: 'Скрипт не использован' })
        break
      default:
        setScore({ type: 'good', value: 'Отлично' })
    }
  }, [])

  return (
    <div className="table-row">
      <div className="table-row-cl cl--type">
        <div className="table-row-cl-arrow">{getCallStatus()}</div>
      </div>

      <div className="table-row-cl cl--time">{formatToTime(item.date)}</div>

      <div className="table-row-cl cl--staff">
        <div className="table-row-cl-avatar">
          <Avatar />
        </div>
      </div>

      <div className="table-row-cl cl--call">{item.from_number}</div>

      <div className="table-row-cl cl--source">{item.source || '-'}</div>

      <div className="table-row-cl cl--score">
        <div className={`table-row-cl-score score--${score.type}`}>{score.value}</div>
      </div>

      <div className="table-row-cl cl--duration">
        <div className={!item.record ? 'duration-time' : 'duration-time--alone'}>
          {formatTime(item.time * 60)}
        </div>
        {item.record ? <Player item={item} /> : <div className="player-cup"></div>}
      </div>
    </div>
  )
}

export default TableRow
