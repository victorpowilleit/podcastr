import Image from 'next/image'
import { useContext, useEffect, useRef, useState } from 'react'
import Slider from 'rc-slider'

import { usePlayer } from '../../contexts/PlayerContext'

import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
import convertDurationToTimeString from '../../utils/convertDurationToTimeString'

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)
  function setupProgressListener(){
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate', () =>{
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }
  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount
    setProgress(amount);
  }
  function handleEpisodeEnded(){
    if(hasNext||isShuffling){
      playNext()
    }else{
      clearPlayerState()
    }
  }

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    hasNext,
    hasPrev,
    playNext,
    playPrevious,
    clearPlayerState
  } = usePlayer()

  useEffect(()=>{
    if(!audioRef.current){
      return;
    }
    if(isPlaying){
      audioRef.current.play()
    }else{
      audioRef.current.pause()
    }
  }, [isPlaying])

  const episode = episodeList[currentEpisodeIndex]

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um Podcast para ouvir</strong>
        </div>
      )}


      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
        <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider className={styles.sliderComponent}
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            ref={audioRef}
            src={episode.url}
            autoPlay
            loop={isLooping}
            onPlay={()=>{setPlayingState(true)}}
            onPause={()=>{setPlayingState(false)}}
            onEnded={handleEpisodeEnded}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
          type="button"
          disabled={!episode || episodeList.length == 1}
          className={isShuffling ? styles.isActive : ''}
          onClick={()=>toggleShuffle()}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" disabled={!episode || !hasPrev} onClick={()=>playPrevious()}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            <img src={isPlaying ? "/pause.svg" : "/play.svg"} alt="Tocar" />
          </button>
          <button type="button" disabled={!episode || (!hasNext && !isShuffling)} onClick={()=>playNext()}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button
          type="button"
          disabled={!episode}
          className={isLooping ? styles.isActive : ''}
          onClick={()=>toggleLoop()}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  )
}