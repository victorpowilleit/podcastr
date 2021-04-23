import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import database from '../../server/firebase'
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss'
import { usePlayer } from '../../contexts/PlayerContext';

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    description: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
    // ...
}

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
    // const router = useRouter();
    // const slug =  router.query.slug
    // return <h1>{slug}</h1>

    const{ play } = usePlayer()
    
    return (
        <div className={styles.episode}>{episode.title}
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
                <Image width={700} height={160} src={episode.thumbnail} objectFit="cover" />
                <button type="button" onClick={()=>play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio" />
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: episode.description }}
            />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params

    const data = await database.ref('episodes')
        .orderByChild('id')
        .equalTo(`${slug}`)
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
            return episodes[0]
        })

    const episode = {
        ...data
    }

    return {
        props: { episode },
        revalidate: 3600 //24h
    }
}