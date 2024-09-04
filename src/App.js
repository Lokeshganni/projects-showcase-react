import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    projectsData: [],
    apiStatus: apiStatusConstants.initial,
    category: categoriesList[0].id,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {category} = this.state
    const response = await fetch(
      `https://apis.ccbp.in/ps/projects?category=${category}`,
    )
    if (response.ok) {
      const data = await response.json()
      const formattedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        projectsData: formattedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  handleCategoryChange = event => {
    this.setState({category: event.target.value}, this.getData)
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderSuccess = () => {
    const {projectsData} = this.state
    return (
      <ul className="projects-ul-container">
        {projectsData.map(each => (
          <li className="projects-li-container" key={each.id}>
            <img src={each.imageUrl} alt={each.name} />
            <p>{each.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderFailure = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt=" failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <div className="retry-btn-container">
        <button onClick={() => this.getData()} type="button">
          Retry
        </button>
      </div>
    </div>
  )

  renderProjects = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderSuccess()
      case apiStatusConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <div className="navbar-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </div>
        <div className="main-container">
          <select
            onChange={this.handleCategoryChange}
            className="select-ele-container"
          >
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          <div>{this.renderProjects()}</div>
        </div>
      </div>
    )
  }
}

export default App
