import { createContext, ReactNode, useContext, useState } from 'react'

type Episode = {
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
  playNext: () =>void;
  playPrevious: () =>void;
  togglePlay: () => void;
  toggleLoop: () => void;
  setPlayingState: (state: boolean) => void;
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContentProviderProps = {
  children: ReactNode
}

export function PlayerContextProvider({ children }: PlayerContentProviderProps) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)

  const play = (episode: Episode) => {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  const playList = (list: Episode[], index: number) => {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleLoop = () => {
    setIsLooping(!isPlaying)
  }

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state)
  }

  const hasNext = currentEpisodeIndex < (episodeList.length - 1)
  const hasPrev = currentEpisodeIndex > 0

  const playNext = () => {
    if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }
  const playPrevious = () => {
    if (hasPrev) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      isLooping,
      play,
      playList,
      hasNext,
      hasPrev,
      playNext,
      playPrevious,
      togglePlay,
      toggleLoop,
      setPlayingState
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)