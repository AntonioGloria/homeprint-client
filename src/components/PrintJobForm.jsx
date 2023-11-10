import axios from 'axios'
import { useState } from 'react'
import ConfirmModal from './ConfirmModal'
import MessageModal from './MessageModal'

const PrintJobForm = () => {
  const serverURL = import.meta.env.VITE_API

  const [showMsgModal, setShowMsgModal] = useState(false)
  const [message, setMessage] = useState(null)
  const [msgClass, setMsgClass] = useState('')
  const [showConfirmModal, setConfirmShowModal] = useState(false)

  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [filePages, setFilePages] = useState(0)
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

      reader.onloadend = (e) => {
        const loadFile = e.target.result
        const fileBin = atob(loadFile.split(',')[1])

        setPreview(loadFile)
        setFilePages(fileBin.match(/\/Type[\s]*\/Page[^s]/g).length)
      }

      // upload file to server for printing
      const formData = new FormData()
      formData.append("file", addedFile)
      const upload = await axios.post(`${serverURL}/upload`, formData)
      setFile(upload.data)
      setMsgClass('')
      setMessage(null)
    }

    catch (error) {
      setMsgClass('error-msg')
      setMessage(error.message)
    }
  }

  const handleConfirm = () => {
    try {
      if (!file) {
        throw new Error("You must add a file!")
      }

      if (!pages) {
        throw new Error(`You must fill in the Pages field!`)
      }

      setConfirmShowModal(true)
      setMsgClass('')
      setMessage('')
    }

    catch (error) {
      setMsgClass('error-msg')
      setMessage(error.message)
      setShowMsgModal(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const options = { pages, copies, monochrome, scale }
      const response = await axios.post(`${serverURL}/print`, { file, options })

      setMsgClass('')
      setMessage(response.data)
      setConfirmShowModal(false);
      setShowMsgModal(true)

      // Reset form defaults for next print job
      setFile(null)
      setFilePages(0)
      setPages('All')
      setCopies(1)
      setScale('fit')
      setMonochrome(true)
    }

    catch (error) {
      setMsgClass('error-msg')
      setMessage(error.message)
      setShowMsgModal(true)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Print A PDF File</h2>
      <div className='form-main'>

        {!(preview && file) &&
          <label htmlFor='print-file' className='file-placeholder' onChange={(e) => handleAddFile(e)}>
            <h2>Click here to add a file to print</h2>
            <input id='print-file' type='file' accept='application/pdf' hidden/>
          </label>
        }

        {(preview && file) &&
          <div className='file-preview'>
            <h3>{file.originalname} - {filePages} Pages</h3>
            <iframe src={preview}/>
            <label htmlFor='print-file' onChange={(e) => handleAddFile(e)}>
              Choose a different file
              <input id='print-file' type='file' accept='application/pdf' hidden/>
            </label>
          </div>
        }

        <div className='form-section'>
          <div className='input-set'>
            <label htmlFor='pages'><strong>Page(s) to Print: </strong></label>
            <input id='pages' name='pages' type='text' value={pages} onChange={(e) => setPages(e.target.value)}/>
          </div>

          <div className='input-set'>
            <label htmlFor='copies'><strong>Copies: </strong></label>
            <input id='copies' name='copies' type='number' min={1} value={copies} onChange={(e) => setCopies(e.target.value)}/>
          </div>

          <div className='input-set'>
          <strong>Color Mode</strong>
            <div className='radio-grp'>
              <label>
                Black & White
                <input type='radio' name='monochrome' checked={ monochrome } onChange={() => setMonochrome(true)}/>
              </label>
              <label>
                Color
                <input type='radio' name='monochrome' checked={ !monochrome } onChange={() => setMonochrome(false)}/>
              </label>
            </div>
          </div>

          <div className='input-set'>
            <strong>Document Scale</strong>
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

      <button style={{alignSelf: 'center'}} type='button' onClick={handleConfirm}>Print File</button>

      {showConfirmModal &&
        <ConfirmModal setShowModal={setConfirmShowModal} summary={{file, pages, copies, filePages, scale, monochrome}}/>
      }
      {showMsgModal &&
        <MessageModal setShowModal={setShowMsgModal} message={message} msgClass={msgClass}/>
      }
    </form>
  )
}

export default PrintJobForm