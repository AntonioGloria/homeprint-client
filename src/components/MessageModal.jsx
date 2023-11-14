const MessageModal = (props) => {
  const { setShowModal, message, msgClass } = props

  return (
    <div className="overlay">
      <div className={`modal ${msgClass}`}>

        <div className="header">
          <h4>{msgClass === "error-msg" ? "✕ ERROR" : "✔ SUCCESS"}</h4>
        </div>

        <div className="content">
          <p className={`msg ${msgClass}`}>
            {message}
          </p>
          <button type="button" className="neutral" onClick={() => setShowModal(false)}>Close</button>
        </div>

      </div>
    </div>
  )
}

export default MessageModal