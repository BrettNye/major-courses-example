import Link from "next/link";
import useSWR from "swr";
import Layout from "../../components/Layout";

export const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Home(){
  const { data, error } = useSWR('/api/courses', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <Layout title="Major courses" action={
      <Link href={'/courses/new'}>
        <a className="btn btn-primary">Add a new course</a>
      </Link>}>

      {data && 
        data.map((c, i) => (
          <div key={i}>
            {c.name} ({c.modality})
            <Link href={`/courses/${c._id}/edit`}>
              <a className="btn btn-success float-end">Edit</a>
            </Link>
          </div>))
      }

      { data?.length == 0 && <p>Nothing to display</p> }

    </Layout>
  )
}