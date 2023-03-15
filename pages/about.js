import Head from "next/head"
import Layout from "../components/layout"

export default function about() {
    return (
        <Layout about>
            <Head>
                <title>About</title>
            </Head>
            <section className="about">
                <p>I am a Computing Science Student.</p>
            </section>
        </Layout>
    )
}