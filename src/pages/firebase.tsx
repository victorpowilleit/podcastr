import Link from 'next/link'
import database from '../server/firebase'


//----------------------------------------------------------------------------
export default function Firebase() {
    //database.ref().set(data)
    database.ref('/').once("value").then((snapshot)=>{console.log(JSON.stringify(snapshot))})
    return (
        <>
            <h1>Firebase</h1>
            <Link href="/">Back</Link>
        </>
    )
}