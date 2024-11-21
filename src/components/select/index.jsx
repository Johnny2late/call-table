import React, { useState, memo, useRef, useEffect } from 'react'
import { useMask } from '@react-input/mask'

import { useClickOutside } from '../../hooks'
import { isValidDate } from '../../helpers'

import ArrowSelect from '../../assets/svg/arrowSelect'
import Calendar from '../../assets/svg/calendar'

import './style.css'

const Select = memo(
  ({
    onChange,
    reset,
    list = [],
    type = 'single', // single || date
    positionDropdown = 'left', // left || right
  }) => {
    const mask = '__.__.__-__.__.__'

    const selectRef = useRef(null)
    const inputRef = useMask({
      mask: mask,
      replacement: { _: /\d/ },
    })

    const [date, setDate] = useState('')
    const [invalidDate, setInvalidDate] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [selecIndex, setSelecIndex] = useState(0)
    const [select, setSelct] = useState(list[0] || null)

    useClickOutside(selectRef, () => setIsOpen(false))

    const parseDateRange = dateRange => {
      const [from, to] = dateRange.split('-').map(date => {
        const [day, month, year] = date.split('.')
        return `20${year}-${month}-${day}`
      })
      return { from, to }
    }

    const handleSelect = (item, i) => {
      setSelct(item)
      setSelecIndex(i)
      if (item.isDate) return
      onChange(item)
      setIsOpen(false)
    }

    const selectDirection = (index, direction) => {
      const newIndex = index + direction

      if (newIndex < 0 || newIndex >= list.length) return

      if (isOpen) setIsOpen(false)

      if (list[newIndex].isDate) setIsOpen(true)

      if (list[newIndex].disabled) {
        selectDirection(newIndex, direction)
        return
      }

      if (!list[newIndex].isDate) onChange(list[newIndex])
      setSelecIndex(newIndex)
      setSelct(list[newIndex])
    }

    useEffect(() => {
      if (select.isDate && isOpen && inputRef.current) {
        inputRef.current.focus()
      }
    }, [select, isOpen])

    useEffect(() => {
      if (!reset) {
        setSelecIndex(0)
        setSelct(list[0])
      }
    }, [reset])

    useEffect(() => {
      setInvalidDate(false)

      const parseDate = parseDateRange(date)
      const isValidFrom = isValidDate(parseDate.from)
      const isValidTo = isValidDate(parseDate.to)
      const isFullDate = date.length === mask.length

      if (isFullDate && (!isValidFrom || !isValidTo)) {
        setInvalidDate(true)
      }
      if (isFullDate && isValidFrom && isValidTo) {
        onChange({ ...list[selecIndex], slot: parseDate })
      }
    }, [date, select])

    return (
      <div className="select" ref={selectRef}>
        {type === 'single' ? (
          <div className="select-label-wrapper" onClick={() => setIsOpen(!isOpen)}>
            <div className={`select-label${selecIndex !== 0 ? ' select-label--blue' : ''}`}>
              {select.value || ''}
              <div className={`select-label-arrow${isOpen ? ' select-label-arrow--show' : ''}`}>
                <ArrowSelect fill={isOpen ? '#002CFB' : '#ADBFDF'} />
              </div>
            </div>
          </div>
        ) : (
          <div className="select-label-wrapper">
            <div
              className={`select-label-arrow select-label-arrow--left
                ${selecIndex === 0 ? ' select-label-arrow--left--disabled' : ''}`}
              onClick={() => selectDirection(selecIndex, -1)}
            >
              <ArrowSelect />
            </div>

            <div className="select-label" onClick={() => setIsOpen(!isOpen)}>
              <div className="select-label-calendar">
                <Calendar />
              </div>
              <div className="select-label-value">
                {(select.isDate && date.length === mask.length && !invalidDate
                  ? date
                  : select.value) || ''}
              </div>
            </div>

            <div
              className={`select-label-arrow select-label-arrow--right
                ${selecIndex === list.length - 1 ? ' select-label-arrow--right--disabled' : ''}`}
              onClick={() => selectDirection(selecIndex, 1)}
            >
              <ArrowSelect />
            </div>
          </div>
        )}

        {isOpen && (
          <div className={`select-dropdown select-dropdown--${positionDropdown}`}>
            {list.map((el, i) => (
              <div
                key={el.id}
                className={`select-dropdown-item
                  select-dropdown-item--${type}
                  ${select.id === el.id ? ' select-dropdown-item--select' : ''}
                  ${el.disabled ? ' select-dropdown-item--disabled' : ''}`}
                onClick={() => handleSelect(el, i)}
              >
                {!el.isDate ? (
                  el.value
                ) : (
                  <>
                    {el.value}
                    <div className="select-dropdown-item-input">
                      <input
                        className={invalidDate ? 'input--invalid' : ''}
                        type="text"
                        value={date}
                        ref={inputRef}
                        placeholder={mask}
                        onChange={e => setDate(e.target.value)}
                      />
                      <Calendar />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'
export { Select }
