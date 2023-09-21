import axios from 'axios'
import { useState } from 'react'

const PrintJobForm = () => {
  const serverURL = import.meta.env.VITE_API

  const [preview, setPreview] = useState(null)
  const [message, setMessage] = useState(null)
  const [file, setFile] = useState(null)
  const [pages, setPages] = useState('All')
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
      setMessage(error)
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
      setMessage(error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Print A PDF File</h2>
      <div className='form-main'>
        <label htmlFor='print-file' className='form-section' onChange={(e) => handleAddFile(e)}>
          <object data={preview} className='pdf-viewer' type='application/pdf'>
            <div className='file-preview'>
              <h2>Click here to add a file to print</h2>
            </div>
          </object>
          <input id='print-file' type='file' accept='application/pdf' hidden/>
        </label>

        <div className='form-section'>
          <div className='input-set'>
            <label htmlFor='pages'><strong>Page(s) to Print: </strong></label>
            <input name='pages' type='text' value={pages} onChange={(e) => setPages(e.target.value)}/>
          </div>

          <div className='input-set'>
            <label htmlFor='copies'><strong>Copies: </strong></label>
            <input name='copies' type='number' min={1} value={copies} onChange={(e) => setCopies(e.target.value)}/>
          </div>

          <div className='input-set'>
          <label htmlFor='monochrome'><strong>Color Options</strong></label>
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

          <div className='input-set'>
            <label htmlFor='scale'><strong>Document Scale</strong></label>
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
        </div>
      </div>

      <div className='form-end'>
        <button type='submit'>Print File</button>
        {message && <p>{message}</p>}
      </div>

    </form>
  )
}

export default PrintJobForm