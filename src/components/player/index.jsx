import React, { useState, useEffect } from 'react'

import { formatTime } from '../../helpers'
import { fetchRecord } from '../../api'

import Play from '../../assets/svg/play'
import Stop from '../../assets/svg/stop'
import Download from '../../assets/svg/download'
import Close from '../../assets/svg/close'

import './style.css'

const Player = ({ item }) => {
  const [audio, setAudio] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [timeLeft, setTimeLeft] = useState(item.time * 60)
  const [isPlay, setIsPlay] = useState(false)
  const [isLoad, setIsLoad] = useState(false)

  const getRecord = () => {
    setIsLoad(true)
    const loadData = async () => {
      try {
        const audioUrl = await fetchRecord(item.record, item.partnership_id)
        const audioInstance = new Audio(audioUrl)

        setAudio(audioInstance)
        setAudioUrl(audioUrl)
      } catch (err) {
        console.error(err)
        setIsLoad(false)
      } finally {
        setIsLoad(false)
      }
    }
    loadData()
  }

  const handleDownload = () => {
    setIsLoad(true)
    const a = document.createElement('a')
    a.href = audioUrl
    a.download = `record_${item.date}.mp3`
    a.click()

    setTimeout(() => {
      setIsLoad(false)
    }, 500)
  }

  const handlePlay = () => {
    if (!isPlay) {
      audio.play()
      setIsPlay(true)
    } else {
      audio.pause()
      setIsPlay(false)
    }
  }

  const handleRemove = () => {
    audio.pause()
    setIsPlay(false)
    setAudio(null)
    setAudioUrl(null)
    setTimeLeft(item.time * 60)
  }

  useEffect(() => {
    let timer
    if (isPlay && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => Math.max(prevTime - 1, 0))
      }, 1000)
    }
    return () => {
      clearInterval(timer)
    }
  }, [isPlay, timeLeft])

  useEffect(() => {
    if (audio)
      audio.addEventListener('ended', () => {
        setIsPlay(false)
        setTimeLeft(item.time * 60)
      })
    return () => {
      if (audio) audio.removeEventListener('ended', () => setIsPlay(false))
    }
  }, [])

  return (
    <div className={`player${isPlay || isLoad || audio ? ' player--show' : ''}`}>
      <div className="player-time">{formatTime(timeLeft)}</div>

      <div className="player-play" onClick={() => (!audio ? getRecord() : handlePlay())}>
        {isPlay ? <Stop /> : <Play fill={audio ? '#002CFB' : '#ADBFDF'} />}
      </div>

      <div className="player-line"></div>

      <div className="player-load" onClick={() => (!audio ? getRecord() : handleDownload())}>
        {isLoad ? (
          <div className="player-load-circle"></div>
        ) : (
          <Download fill={audio ? '#002CFB' : '#ADBFDF'} />
        )}
      </div>

      <div className="player-remove" onClick={handleRemove}>
        {audio && <Close />}
      </div>
    </div>
  )
}

export default Player
