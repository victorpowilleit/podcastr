import Link from 'next/link'
import database from '../server/firebase'

//----------------------------------------------------------------------------
export default function SSR(props) {
    console.log(props)
    //database.ref('/').once("value").then((snapshot) => { console.log(JSON.stringify(snapshot)) })
    return (
        <>
            <h1>SSR - Server Side Rendering</h1>
            <Link href="/">Back</Link>
        </>
    )
}

// export async function getServerSideProps() {
export async function getStaticProps() {
    const response = await database.ref().once('value')
        .then(function(snapshot){
            return snapshot
        })
    return {
        props: {
            data: JSON.stringify(response)
        },
        revalidate: 60*60 //1 per hour
    }
}


