import { useState, useEffect } from 'react'
import './App.css'

const GAME_STATES = {
  IDLE: 'idle',
  WAITING: 'waiting', 
  READY: 'ready',
  FINISHED: 'finished'
}

function App() {
  const [gameState, setGameState] = useState(GAME_STATES.IDLE)
  const [reactionTime, setReactionTime] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [rankings, setRankings] = useState([])

  useEffect(() => {
    const savedRankings = localStorage.getItem('reactionGameRankings')
    if (savedRankings) {
      setRankings(JSON.parse(savedRankings))
    }
  }, [])

  const startGame = () => {
    setGameState(GAME_STATES.WAITING)
    setReactionTime(null)
    
    const delay = Math.random() * 4000 + 1000
    setTimeout(() => {
      setGameState(GAME_STATES.READY)
      setStartTime(Date.now())
    }, delay)
  }

  const handleReaction = () => {
    if (gameState === GAME_STATES.READY) {
      const endTime = Date.now()
      const time = endTime - startTime
      setReactionTime(time)
      setGameState(GAME_STATES.FINISHED)
      
      const newRankings = [...rankings, { time, date: new Date().toISOString() }]
        .sort((a, b) => a.time - b.time)
        .slice(0, 10)
      
      setRankings(newRankings)
      localStorage.setItem('reactionGameRankings', JSON.stringify(newRankings))
    } else if (gameState === GAME_STATES.WAITING) {
      setGameState(GAME_STATES.IDLE)
      setReactionTime('フライング！')
    }
  }

  const resetGame = () => {
    setGameState(GAME_STATES.IDLE)
    setReactionTime(null)
    setStartTime(null)
  }

  const clearRankings = () => {
    if (window.confirm('ランキングをリセットしますか？')) {
      setRankings([])
      localStorage.removeItem('reactionGameRankings')
    }
  }

  const getResultMessage = (time) => {
    if (typeof time !== 'number') return ''
    if (time < 200) return '超人的！'
    if (time < 300) return 'とても早い！'
    if (time < 400) return '早い！'
    if (time < 500) return '普通'
    return 'もう少し頑張ろう'
  }

  return (
    <div className="app">
      <h1>反射神経ゲーム</h1>
      
      <div className="game-area">
        {gameState === GAME_STATES.IDLE && (
          <div className="game-content">
            <p>準備ができたらスタートボタンを押してください</p>
            <button onClick={startGame} className="start-button">
              スタート
            </button>
          </div>
        )}

        {gameState === GAME_STATES.WAITING && (
          <div className="game-content waiting" onClick={handleReaction}>
            <p>合図を待って...</p>
            <p>早すぎるとフライングです</p>
          </div>
        )}

        {gameState === GAME_STATES.READY && (
          <div className="game-content ready" onClick={handleReaction}>
            <p>今だ！クリック！</p>
          </div>
        )}

        {gameState === GAME_STATES.FINISHED && (
          <div className="game-content finished">
            <h2>結果</h2>
            <div className="result">
              {typeof reactionTime === 'number' ? (
                <>
                  <p className="time">{reactionTime}ms</p>
                  <p className="message">{getResultMessage(reactionTime)}</p>
                </>
              ) : (
                <p className="error">{reactionTime}</p>
              )}
            </div>
            <button onClick={resetGame} className="retry-button">
              もう一度
            </button>
          </div>
        )}
      </div>

      <div className="rankings">
        <div className="rankings-header">
          <h2>ランキング</h2>
          {rankings.length > 0 && (
            <button onClick={clearRankings} className="clear-button">
              リセット
            </button>
          )}
        </div>
        
        {rankings.length === 0 ? (
          <p>記録がありません</p>
        ) : (
          <ol>
            {rankings.map((record, index) => (
              <li key={index} className={record.time === reactionTime ? 'current' : ''}>
                <span className="rank">#{index + 1}</span>
                <span className="time">{record.time}ms</span>
                <span className="date">{new Date(record.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

export default App