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
  const [pages, setPages] = useState('All')
  const [copies, setCopies] = useState(1)
  const [scale, setScale] = useState('fit')
  const [monochrome, setMonochrome] = useState(true)
  const [totalPages, setTotalPages] = useState(0)

  const handleError = (error) => {
    setMsgClass('error-msg')
    setMessage(error.message)
    setShowMsgModal(true)
  }

  const handleAddFile = async (e) => {
    try {
      const addedFile = e.target.files[0]

      // create file preview
      let reader = new FileReader()
      reader.readAsDataURL(addedFile)

      reader.onloadend = (e) => {
        const loadFile = e.target.result
        setPreview(loadFile)
      }

      // upload file to server for printing
      const formData = new FormData()
      formData.append("file", addedFile)
      const upload = await axios.post(`${serverURL}/upload`, formData)
      setFile(upload.data)
      setTotalPages(upload.data.filePages)
      setMsgClass('')
      setMessage(null)
    }

    catch (error) {
      handleError(error)
    }
  }

  const calculateTotalPages = (target) => {
    const { id, value } = target
    let calcPages
    let calcCopies

    if (id === 'pages') {
      calcPages = value
      calcCopies = copies
      setPages(calcPages)
    }

    if (id === 'copies') {
      calcCopies = value
      calcPages = pages
      setCopies(calcCopies)
    }

    if (!file) {
      setTotalPages(0)
      return
    }

    if (calcPages ===  "All") {
      setTotalPages(file.filePages * calcCopies)
    }

    else {
      let selectedPages = 0
      let ranges = calcPages.split(',')

      ranges.forEach(range => {
        let subRange = range.split('-')
        if (subRange.length === 1) {
          selectedPages++
        }
        else {
          const start = Number(subRange[0])
          const end = Number(subRange[1])

          selectedPages = end > start ? end - start + 1 : start - end + 1
        }
      })

      setTotalPages(selectedPages * calcCopies)
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
      handleError(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const options = { pages, copies, monochrome, scale }
      const response = await axios.post(`${serverURL}/print`, { file, options, totalPages })

      setMsgClass('')
      setMessage(response.data)
      setConfirmShowModal(false);
      setShowMsgModal(true)

      // Reset form defaults for next print job
      setFile(null)
      setPages('All')
      setCopies(1)
      setScale('fit')
      setTotalPages(0)
      setMonochrome(true)
    }

    catch (error) {
      handleError(error)
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
            <h3>{file.originalname} - {file.filePages} Page{file.filePages > 1 && "s"}</h3>
            <iframe src={preview}/>
            <label htmlFor='print-file' onChange={(e) => handleAddFile(e)}>
              Choose a different file
              <input id='print-file' type='file' accept='application/pdf' hidden/>
            </label>
          </div>
        }

        <div className='form-section'>
          <h3 className='input-set'>Print Settings</h3>
          <div className='input-set'>
            <label htmlFor='pages'><strong>Page(s) to Print: </strong></label>
            <input id='pages' name='pages' type='text' value={pages} onChange={(e) => calculateTotalPages(e.target)}/>
          </div>

          <div className='input-set multi'>
            <div>
              <label htmlFor='copies'><strong>Copies: </strong></label>
              <input id='copies' name='copies' type='number' min={1} size={6} value={copies} onChange={(e) => calculateTotalPages(e.target)}/>
            </div>

            <div>
              <label className='page-count'><strong>Total Pages: </strong></label>
              <input type='text' size={6} disabled readOnly value={totalPages}/>
            </div>
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
        <ConfirmModal setShowModal={setConfirmShowModal} summary={{file, pages, copies, scale, monochrome, totalPages}}/>
      }
      {showMsgModal &&
        <MessageModal setShowModal={setShowMsgModal} message={message} msgClass={msgClass}/>
      }
    </form>
  )
}

export default PrintJobForm