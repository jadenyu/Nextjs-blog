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
                <Link href="https://www.facebook.com/jaden.yu.585">FaceBook</Link>
                <br />
                <Link href="https://github.com/jadenyu">GitHub</Link>
            </section>
        </Layout>
    )
}