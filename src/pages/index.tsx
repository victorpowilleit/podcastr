import Link from 'next/link'
export default function Home() {
  return (
    <>
      <h1>Index</h1>
      <Link href="/firebase">Firebase</Link>
      <br/>
      <Link href="/ssr">SSR</Link>
    </>
  )
}