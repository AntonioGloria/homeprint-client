import axios from 'axios'
import { useState } from 'react'

const PrintJobForm = () => {
  const serverURL = import.meta.env.VITE_API

  const [preview, setPreview] = useState(null)
  const [message, setMessage] = useState(null)
  const [file, setFile] = useState(null)
  const [pages, setPages] = useState('1')
  const [copies, setCopies] = useState(1)
  const [scale, setScale] = useState('fit')
  const [monochrome, setMonochrome] = useState(true)

  const handleAddFile = async (e) => {
    try {
      const addedFile = e.target.files[0]

      // create file preview
      let reader = new FileReader()
      reader.readAsDataURL(addedFile)
      reader.onloadend = (e) => setPreview(e.target.result)

      // upload file to server for printing
      const formData = new FormData()
      formData.append("file", addedFile)
      const upload = await axios.post(`${serverURL}/upload`, formData)
      setFile(upload.data);
    }

    catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const options = { pages, copies, monochrome, scale }
      const response = await axios.post(`${serverURL}/print`, { file, options })
      setMessage(response.data);
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Print A PDF File</h2>
      <div className='form-section'>
        <label htmlFor='print-file' className='file-upload' onChange={(e) => handleAddFile(e)}>
          Choose File to Print
          <input id='print-file' type='file' hidden/>
        </label>
      </div>

      <div className='form-section'>
        <object data={preview} type="application/pdf" width={"500vw"} height={"500vh"}>
          <div className='file-preview'>
            <h3>Upload a file to preview.</h3>
          </div>
        </object>
      </div>

      <div className='form-section'>
        <label htmlFor='pages'>Page(s) to Print: </label>
        <input name='pages' type='text' value={pages} onChange={(e) => setPages(e.target.value)}/>
      </div>

      <div className='form-section'>
        <label htmlFor='copies'>Copies: </label>
        <input name='copies' type='number' min={1} value={copies} onChange={(e) => setCopies(e.target.value)}/>
      </div>

      <div className='form-section'>
      <label htmlFor='monochrome'>Color Options:</label>
        <div className='radio-grp'>
          <label>
            Black and White
            <input type='radio' name='monochrome' checked={ monochrome } onChange={() => setMonochrome(true)}/>
          </label>
          <label>
            Color
            <input type='radio' name='monochrome' onChange={() => setMonochrome(false)}/>
          </label>
        </div>
      </div>

      <div className='form-section'>
        <label htmlFor='scale'>Document Scale:</label>
        <div className='radio-grp'>
          <label>
            Fit
            <input type='radio' name='scale' value={'fit'} checked={scale==='fit'} onChange={(e) => setScale(e.target.value)}/>
          </label>
          <label>
            Shrink
            <input type='radio' name='scale' value={'shrink'} onChange={(e) => setScale(e.target.value)}/>
          </label>
          <label>
            No-Scale
            <input type='radio' name='scale' value={'noscale'} onChange={(e) => setScale(e.target.value)}/>
          </label>
        </div>
      </div>
      <div className='form-end'>
        <button type='submit'>Print</button>
        {message && <p>{message}</p>}
      </div>
    </form>
  )
}

export default PrintJobForm