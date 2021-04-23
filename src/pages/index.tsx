import { useContext } from 'react'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'

import database from '../server/firebase'
import convertDurationToTimeString from '../utils/convertDurationToTimeString'
import { PlayerContext } from '../contexts/PlayerContext'

import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import styles from './home.module.scss'

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
  // ...
}

type HomeProps = {
  latestEpisodes: Episode[],
  allEpisodes: Episode[]
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = useContext(PlayerContext)

  const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Últimos Lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit='cover'
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={()=>playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={()=>playList(episodeList, index + latestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar Episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
      <Link href="/firebase">Firebase</Link>
      <br />
      <Link href="/ssr">SSR</Link>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await database.ref('episodes')
    .limitToFirst(12)
    .once('value')
    .then(function (snapshot) {
      let resArray = []
      snapshot.forEach((childSnapshot) => { resArray.push(childSnapshot.val()) })
      const episodes = resArray.map(episode => {
        return {
          order: episode.order,
          id: episode.id,
          title: episode.title,
          thumbnail: episode.thumbnail,
          members: episode.members,
          publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
          duration: Number(episode.file.duration),
          durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
          description: episode.description,
          url: episode.file.url
        }
      })
      return episodes
    })
  const latestEpisodes = response.slice(0, 2)
  const allEpisodes = response.slice(2, response.length)
  return {
    props: { latestEpisodes, allEpisodes }, revalidate: 1 //1 sec
  }
}