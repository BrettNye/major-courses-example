import Layout from "../../../components/Layout";
import { useRouter } from "next/router";
import { fetcher } from "../index";
import useSWR from "swr";
import CourseForm from "../../../components/CourseForm";

export default function EditCourseForm(){

    let router = useRouter()
    const { data, error } = useSWR('/api/courses/' + router.query.course, fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>


    return(
        <Layout title="Major courses">
            <CourseForm title="Editing a course" course={data}></CourseForm>
        </Layout>
    )
}