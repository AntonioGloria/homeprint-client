const ConfirmModal = (props) => {
  const { setShowModal, summary } = props
  const { file, pages, copies, scale, monochrome } = summary

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
          <div className="print-summary">
            <p>File Name:</p>
            <p>{file?.originalname}</p>

            <p>Selected Pages:</p>
            <p>{pages}</p>

            <p>Copies:</p>
            <p>{copies}</p>

            <p>Total Pages:</p>
            <p>{calculateTotalPages(pages, copies, file.filePages)}</p>

            <p>Color Mode:</p>
            <p>{monochrome ? "Black & White" : "Color"}</p>

            <p>Scale:</p>
            <p>{scale}</p>
          </div>

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