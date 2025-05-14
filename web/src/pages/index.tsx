import Head from "next/head"

export default function Verified() {
  return (
    <>
      <Head>
        <title>Web Payments</title>
        <meta name="description" content="Web Payments" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Web Payments
          </h1>
        </div>
      </main>
    </>
  )
}
