import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import JsonToForm from 'json-reactform';
import Modal from 'react-modal';
import './index.css'

const model = {
  // "Plan Date": {
  //   "type": "date",
  //   "format": "dd MMMM yyyy",
  //   "required": true
  // },
  // "Qty": {
  //   "type": "number",
  //   "required": true
  // },
  // "Item Number": {
  //   "type": "select",
  //   "required": true,
  //   "options": [ //use static json arry to get options
  //     {
  //       "value": "1",
  //       "label": "item 1"
  //     },
  //     {
  //       "value": "2",
  //       "label": "item 2"
  //     }
  //   ],
  // },
  // "Parts": {
  //   "type": "checkbox",
  //   "required": true,
  //   "options": [ //use static json arry to get options
  //     {
  //       "value": "checkbox_item_1",
  //       "label": "Checkbox 1"
  //     },
  //     {
  //       "value": "checkbox_item_2",
  //       "label": "Checkbox 2"
  //     }
  //   ],
  // },
  // "Status": {
  //   "type": "radio",
  //   "required": true,
  //   "options": [ //use static json arry to get options
  //     {
  //       "value": "completed",
  //       "label": "Completed"
  //     },
  //     {
  //       "value": "not_completed",
  //       "label": "Not Completed"
  //     }
  //   ],
  // },
  // "Save": { // button submit
  //   "type": "submit",
  // }
}

const addElementModelCustomStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#00bba1'
  }
};

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      jsonChangeTimer: null,
      jsonToForm: model,
      jsonToFormString: JSON.stringify(model, null, 2),
      isJsonValid: true,
      errorMessage: '',
      showAddElementModel: false,
      editJson: {
        name: '',
        elementProps: {

        }
      }
    }
  }

  submit = (params) => {
    console.log(params);
  }

  renderTitle() {
    return (
      <h1 className='title'>
        JSON Reactform Playground
      </h1>
    )
  }

  onElementClick = (elementName) => {
    let editJson = {}
    editJson.elementProps = this.state.jsonToForm[elementName]
    editJson.name = elementName
    this.setState({
      editJson: editJson,
      showAddElementModel: true
    })
  }

  onElementDelete = (elementName) => {
    let jsonToForm = this.state.jsonToForm
    delete jsonToForm[elementName]
    this.setState({
      jsonToForm: jsonToForm,
      jsonToFormString: JSON.stringify(jsonToForm, null, 2)
    })
  }

  renderElementsFromJson() {
    let elementsName = []
    for (let elementName in this.state.jsonToForm) {
      elementsName.push(
        <div className={'elementName'} title='Edit Element' onClick={() => this.onElementClick(elementName)}>
          {elementName}
          <div title='Delete element' onClick={(e) => {
            this.onElementDelete(elementName)
            e.stopPropagation()
          }}
            className='elementDeleteButton'>x</div>
        </div>
      )
    }
    return elementsName
  }

  onAddElementClick = () => {

    this.setState({
      showAddElementModel: true,
      editJson: {
        name: '',
        elementProps: {
          type: 'text',
          required: true,
          disabled: false
        }
      }
    })
  }

  onAddElement = () => {
    let jsonToForm = this.state.jsonToForm
    jsonToForm[this.state.editJson.name] = this.state.editJson.elementProps
    this.setState({
      showAddElementModel: false,
      jsonToForm: jsonToForm,
      jsonToFormString: JSON.stringify(jsonToForm, null, 2),
      isJsonValid: true,
      errorMessage: ''
    })
  }

  onAddElementClose = () => {
    this.setState({
      showAddElementModel: false
    })
  }

  onElementNameChange = (event) => {
    let editJson = this.state.editJson
    editJson.name = event.target.value
    this.setState({ editJson: editJson })
  }

  onElementTypeChange = (event) => {
    let editJson = {
      name: this.state.editJson.name,
      elementProps: {
        type: event.target.value,
        required: true,
      }
    }
    switch (editJson.elementProps.type) {
      case 'text':
      case 'number':
      case 'textarea':
        // editJson.defaultValue = ''
        editJson.elementProps.placeHolder = ''
        break
      case 'date':
        // editJson.defaultValue = new Date()
        editJson.elementProps.placeHolder = null
        editJson.elementProps.format = ''
        break;
      case 'select':
        // editJson.defaultValue
        editJson.elementProps.options = [
          {'value': '1', 'label': 'item 1'},
          {'value': '2', 'label': 'item 2'}
        ]
        break;
      case 'checkbox':
        editJson.elementProps["options"] = [ //use static json arry to get options
          {
            "value": "checkbox_item_1",
            "label": "Checkbox 1"
          },
          {
            "value": "checkbox_item_2",
            "label": "Checkbox 2"
          }
        ]
        break;
    }
    this.setState({ editJson: editJson });
  }

  onRequiredChange = (event) => {
    let editJson = this.state.editJson
    editJson.elementProps.required = event.target.value === 'true' ? true : false
    this.setState({ editJson: editJson });

  }

  onDisabledChange = (event) => {
    let editJson = this.state.editJson
    editJson.elementProps.disabled = event.target.value === 'true' ? true : false
    this.setState({ editJson: editJson })
  }

  onDefaultValueChange = (event) => {
    let editJson = this.state.editJson
    editJson.elementProps.defaultValue = event.target.value
    this.setState({ editJson: editJson });
  }

  onPlaceHolderChange = (event) => {
    let editJson = this.state.editJson
    editJson.elementProps.placeHolder = event.target.value
    this.setState({ editJson: editJson });

  }

  renderVisualEditor() {
    let editJson = this.state.editJson

    let placeHolderElement = editJson.elementProps.placeHolder !== null ? (
      <label>
        Place Holder
        <input type='text' onChange={this.onPlaceHolderChange} value={editJson.elementProps.placeHolder}></input>
      </label>
    ) : null

    return (
      <div>
        {this.renderElementsFromJson()}
        <div className="elementName" onClick={this.onAddElementClick}>Add Element</div>
        <Modal
          isOpen={this.state.showAddElementModel}
          contentLabel="Minimal Modal Example"

          onRequestClose={this.onAddElementClose}
          style={addElementModelCustomStyles}
        >
          <div className="paneHeader">
            <h2>Add / Edit Element</h2>
          </div>
          <label>
            Name
            <input type='text' onChange={this.onElementNameChange} value={editJson.name}></input>
          </label>
          <br />
          <label>
            Element Type
          <select value={editJson.elementProps.type} onChange={this.onElementTypeChange}>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="textarea">Textarea</option>
              <option value="date">Date</option>
              <option value="select">Select</option>
              <option value="checkbox">Checkbox</option>
              <option value="radio">Radio</option>
            </select>
          </label>
          <br />
          <label>
            Required
          <select value={editJson.elementProps.required} onChange={this.onRequiredChange}>
              <option value='true'>True</option>
              <option value="false">False</option>
            </select>
          </label>
          <br />
          <label>
            Disabled
          <select value={editJson.elementProps.disabled} onChange={this.onDisabledChange}>
              <option value='true'>True</option>
              <option value="false">False</option>
            </select>
          </label>
          {/* <label>
            Default Value
            <input type='text' onChange={this.onDefaultValueChange} value={editJson.defaultValue}></input>
          </label> */}
          <br />
          {placeHolderElement}
          <br />
          <button onClick={this.onAddElement}>Done</button>
          <button onClick={this.onAddElementClose}>Cancel</button>

        </Modal>
      </div>
    )
  }

  renderVisualEditorPane() {
    return (
      <div className="pane">
        <div className="paneHeader">
          <h2>Visual Editor</h2>
        </div>
        <div className="paneContent">
          {this.renderVisualEditor()}
        </div>
      </div>
    )
  }

  getClassNamesForEditPane() {
    let classString = 'paneContent textEditorPaneContent'
    if (!this.state.isJsonValid) {
      classString += ' errorPaneContent'
    }
    return classString
  }

  onEditorTextChange = (event) => {
    this.setState({
      jsonToFormString: event.target.value
    })
  }

  onTextEditorRun = () => {
    // if (this.state.jsonChangeTimer) {
    //   clearTimeout(this.state.jsonChangeTimer)
    // }

    // let jsonText = jsonToFormString

    // let jsonChangeTimer = setTimeout(() => {
    let json = {}
    try {
      if (this.state.jsonToFormString !== '')
        json = JSON.parse(this.state.jsonToFormString)
    }
    catch (e) {
      this.setState({ isJsonValid: false, errorMessage: 'JSON is not meaningful!' })
      return
    }

    this.setState({
      jsonToForm: json,
      errorMessage: '',
      isJsonValid: true
    })
    // }, JSON_CHANGE_DEBOUNCE_TIME);

    // this.setState({
    //   jsonChangeTimer: jsonChangeTimer
    // })
  }

  renderTextEditor() {
    return <textarea className='textEditor' onChange={this.onEditorTextChange} value={this.state.jsonToFormString} />
  }

  renderTextEditorPane() {
    return (
      <div className="pane">
        <div className="paneHeader">
          <div>
            <h2>Text Editor</h2>
            <div onClick={this.onTextEditorRun} className='runButton'>Run</div>
          </div>

          <div className='errorMessage'>{this.state.errorMessage}</div>
        </div>
        <div className={this.getClassNamesForEditPane()}>
          {this.renderTextEditor()}
        </div>
      </div>
    )
  }

  renderResultPane() {
    return (
      <div className="pane resultPane">
        <div className="paneHeader"> <h2 >Result</h2></div>
        <div className="paneContent resultPaneContent">
          <JsonToForm model={this.state.jsonToForm} onSubmit={this.submit} />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="page">
        {this.renderTitle()}
        <div className='content'>
          <div className="subcontent leftSubcontent">
            {this.renderVisualEditorPane()}
            {this.renderTextEditorPane()}
          </div>
          <div className="subcontent rightSubcontent">
            {this.renderResultPane()}
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))