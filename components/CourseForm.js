import "react-datepicker/dist/react-datepicker.css"
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import DatePicker from 'react-datepicker'
import * as yup from 'yup'
import useSWR, { mutate, useSWRConfig } from "swr"
import {parseJSON } from 'date-fns'


const validationSchema = yup.object({
    crn: yup.number().required(),
    name: yup.string().required(),
    description:yup.string(),
    modality: yup.string().oneOf(["F2F", "VTL", "ONL"]),
    startDate:yup.date().required(),
    endDate:yup.date()
})

function VHelp({msg}){
    return <div className='invalid-feedback'>{msg}</div>
}

function FieldLabel({field, label, required}){
    return(
        <label htmlFor={field} className="form-label col-sm-2 text-end">
            <strong>{label || field} { required && <span className='text-danger'>*</span>}</strong>
        </label>
    )
}

export default function CourseForm({course, title}){
    let router = useRouter()
    let cid = router.query.course
    let is_new = cid === undefined
    if(!is_new){
        course.startDate = parseJSON(course.startDate)
        if(course.endDate){
            course.endDate = parseJSON(course.endDate)
        }
    }

    const {handleSubmit, handleChange, values, errors, setFieldValue} = useFormik({
        initialValues: is_new ? {crn:"", name:"", modality:"", startDate:"", endDate:""}:{...course},
        validationSchema,
        onSubmit(values){
            fetch(`/api/courses${is_new ? "":"/"+cid}`,{
                method: is_new ? 'POST' : 'PUT',
                body: JSON.stringify(values)
            }).then((res)=>{
                if(!res.ok) throw Error(res.statusText)
                router.push("/courses")
                mutate('/api/courses')
                mutate('/api/course/' + cid)
                toast.success(`Successfully "updated`)
            }).catch((err)=>{
                toast.error(`Failed to submit your message: ${err.message}`)
            })
        }
    })

    function fieldAttrs(field){
        return {
            className:`form-control ${errors[field]? "is-invalid":""}`,
            id:field,
            name:field,
            value:values[field],
            onChange:handleChange
        }
    }

    return (
        <div className="container">
            <h2 className="py-3">{title}</h2>
            <form action="" onSubmit={handleSubmit}>
                <div className="mb-3 row">
                    <FieldLabel field="crn" required></FieldLabel>
                    <div className="has-validation col-sm-9">
                        <input type="number" {...fieldAttrs('crn')}/>
                        <VHelp msg={errors.crn}></VHelp>
                    </div>
                </div>

                <div className="mb-3 row">
                    <FieldLabel field="name" required></FieldLabel>
                    <div className="has-validation col-sm-9">
                        <input type="text" {...fieldAttrs('name')}/>
                        <VHelp msg={errors.name}></VHelp>
                    </div>
                </div>

                <div className="mb-3 row">
                    <FieldLabel field="description" required></FieldLabel>
                    <div className="has-validation col-sm-9">
                        <textarea row="6" {...fieldAttrs('description')}></textarea>
                        <VHelp msg={errors.description}></VHelp>
                    </div>
                </div>

                <div className="mb-3 row">
                    <FieldLabel field="modality" required></FieldLabel>
                    <div className="has-validation col-sm-9">
                        <select {...fieldAttrs('modality')}>
                            <option value="">Not selected</option>
                                {
                                    validationSchema.fields['modality'].describe().oneOf.map((item,i)=>(
                                        <option key={i} value={item}>{item}</option>
                                    ))
                                }
                        </select>
                        <VHelp msg={errors.modality}></VHelp>
                    </div>
                </div>

                <div className="mb-3 row">
                    <FieldLabel field="startDate" required></FieldLabel>
                    <div className="has-validation col-sm-9">
                        <DatePicker {...fieldAttrs('startDate')}
                            selected={values.startDate}
                            onChange={(date)=>setFieldValue('startDate', date)}>
                        </DatePicker>
                        <VHelp msg={errors.startDate}></VHelp>
                    </div>
                </div>

                <div className="mb-3 row">
                    <FieldLabel field="endDate" required></FieldLabel>
                    <div className="has-validation col-sm-9">
                        <DatePicker {...fieldAttrs('endDate')}
                            selected={values.endDate}
                            onChange={(date)=>setFieldValue('endDate', date)}>
                        </DatePicker>
                        <VHelp msg={errors.endDate}></VHelp>
                    </div>
                </div>

                <div className="mb-3 row">
                    <div className="col-sm-12 offset-sm-2 text-start">
                        <button type='submit' className='btn btn-primary ms-1'>Submit</button>
                        <button type='button' className='btn btn-danger ms-2' onClick={()=>router.push("/courses")}>Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    )
}