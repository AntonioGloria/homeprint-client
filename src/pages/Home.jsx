import PrintJobForm from '../components/PrintJobForm'

const Home = () => {
  return (
    <div>
      <h1>
        Welcome to Home Print!
        <object
          data={"/favicon.svg"}
          width={"60em"}
          style={{verticalAlign:"bottom", marginLeft:"0.5em"}}
        >
        </object>
      </h1>
      <PrintJobForm/>
    </div>
  )
}

export default Home