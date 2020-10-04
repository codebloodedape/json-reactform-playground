import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import JsonToForm from 'json-reactform';
import './index.css'

const model = {
  "Plan Date": {
    "type": "date",
    "format": "dd MMMM yyyy",
    "required": true
  },
  "Qty": {
    "type": "number",
    "required": true
  },
  "Item Number": {
    "type": "select",
    "required": true,
    "options": [ //use static json arry to get options
      {
        "value": "1",
        "label": "item 1"
      },
      {
        "value": "2",
        "label": "item 2"
      }
    ],
  },
  "Parts": {
    "type": "checkbox",
    "required": true,
    "options": [ //use static json arry to get options
      {
        "value": "checkbox_item_1",
        "label": "Checkbox 1"
      },
      {
        "value": "checkbox_item_2",
        "label": "Checkbox 2"
      }
    ],
  },
  "Status": {
    "type": "radio",
    "required": true,
    "options": [ //use static json arry to get options
      {
        "value": "completed",
        "label": "Completed"
      },
      {
        "value": "not_completed",
        "label": "Not Completed"
      }
    ],
  },
  "Save": { // button submit
    "type": "submit",
  }
}

const JSON_CHANGE_DEBOUNCE_TIME = 800

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      jsonChangeTimer: null,
      jsonToForm: model,
      isJsonValid: true,
      errorMessage: ''
    }
  }

  editorTextChange = (e) => {
    if (this.state.jsonChangeTimer) {
      clearTimeout(this.state.jsonChangeTimer)
    }

    let jsonText = e.target.value

    let jsonChangeTimer = setTimeout(() => {
      // let jsonText = e.target.value
      let json
      try {
        json = JSON.parse(jsonText)
      }
      catch (e) {
        this.setState({ isJsonValid: false, errorMessage: 'Parse error' })
        return
      }

      this.setState({
        jsonToForm: json,
        errorMessage: '',
        isJsonValid: true
      })
    }, JSON_CHANGE_DEBOUNCE_TIME);

    this.setState({
      jsonChangeTimer: jsonChangeTimer
    })
  }

  setError(errorMessage) {
  }

  renderEditor() {
    return <textarea className='editor' onChange={this.editorTextChange} defaultValue={JSON.stringify(model, null, 2)} />
  }

  submit = (params) => {
    console.log(params);
  }

  getClassNamesForEditPane() {
    let classString = 'paneContent'
    if (!this.state.isJsonValid) {
      classString += ' errorPaneContent'
    }
    return classString
  }

  render() {
    return (
      <div>
        <h1 className='title'>
          json-reactform Playground
      </h1>
        <div className='content'>
          <div className="pane">
            {/* <div className='errorMessage'>{this.state.errorMessage}</div> */}
            <div className={this.getClassNamesForEditPane()}>
              {this.renderEditor()}
            </div>
          </div>
          <div className="pane">
            <div className="paneContent">
              <JsonToForm model={this.state.jsonToForm} onSubmit={this.submit} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))