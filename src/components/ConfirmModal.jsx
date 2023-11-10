const ConfirmModal = (props) => {
  const { setShowModal, summary } = props
  const { file, filePages, pages, copies, scale, monochrome } = summary

  const calculateTotalPages = (selection, copies, filePages) => {
    if (selection ===  "All") {
      return filePages * copies
    }

    else {
      let totalPages = 0
      let ranges = selection.split(',')

      ranges.forEach(range => {
        let subRange = range.split('-')
        if (subRange.length === 1) {
          totalPages++
        }
        else {
          const start = Number(subRange[0])
          const end = Number(subRange[1])

          totalPages = end > start ? end - start + 1 : start - end + 1
        }
      })

      return totalPages * copies
    }
  }

  return (
    <div className="overlay">
      <div className="modal">
        <div className="header">
          <h4>🖶 Review Print Job</h4>
        </div>
        <div className="content">
          <h2>Print Job Details</h2>
          <ul className="print-summary">
            <li>
              File Name:<strong>{file?.originalname}</strong>
            </li>
            <li>
              Selected Pages:<strong>{pages}</strong>
            </li>
            <li>
              Copies:<strong>{copies}</strong>
            </li>
            <li>
              Total Pages:<strong>{calculateTotalPages(pages, copies, filePages)}</strong>
            </li>
            <li>
              Color Mode:<strong>{monochrome ? "Black & White" : "Color"}</strong>
            </li>
            <li>
              Scale:<strong>{scale}</strong>
            </li>
          </ul>

          <h4>Continue with printing?</h4>

          <div className="confirm-btns">
            <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit">Print</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal