import 'bootstrap/dist/css/bootstrap.css'

export default function Layout({ title, action, children }) {
  return (
    <div className='container'>
      <div className='d-flex align-items-center'>
        <h1 className='display-5 flex-grow-1'>{title}</h1>
        <span>{action}</span>
      </div>
      <hr />
      { children }
    </div>
  )
}