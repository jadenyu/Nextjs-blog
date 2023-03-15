import Head from "next/head"
import Layout from "../components/layout"
import Link from "next/link"

export default function about() {
    return (
        <Layout about>
            <Head>
                <title>Contact</title>
            </Head>
            <section className="about">
                <Link href="https://twitter.com/Jaden_Yu04">Twitter</Link>
                <br/>
                <Link href="">FaceBook</Link>
                <br />
                <Link href="">GitHub</Link>
            </section>
        </Layout>
    )
}