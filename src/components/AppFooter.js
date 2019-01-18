import React from 'react'

class AppFooter extends React.Component {
  constructor(props) {
    super(props)
  }

  render(props) {
    return (
      <footer className='footer'>
        <p>
          <a href='https://docs.google.com/forms/d/e/1FAIpQLSddXqlQaFd8054I75s4UZEPeQAh_ardxRl11YYw3b2JBk0Y-Q/viewform'>Palautelomake</a>
        </p>
      </footer>
    )
  }
}

export default AppFooter