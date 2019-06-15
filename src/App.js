import React from 'react';
import './App.css';

class App extends React.Component {
  state = { 
    userInput: '',
    result: ''
  }

  handleChange = (event) => {
    this.setState({userInput: event.target.value})
  }

  convertToITT = (event) => {
    event.preventDefault();
    const { userInput } = this.state;
    const subtitleByLine = this.splitLines(userInput)
    return this.formatForITT(subtitleByLine);
  }

  splitLines = (userInput) => {
    const InputArray = userInput.split('\n').filter(line => line !== '')
    return InputArray.map(line => line.split('|')).map(line => line.map(str => str.trim()))
  }

  formatForITT = (subtitleArray) => {
    const formattedResult = subtitleArray.map((currentValue, index, array) => {
      const [startTime, subtitle] = currentValue; 
      const endTime = array[index+1] ? array[index+1][0] : startTime;
      const formattedStartTime = this.transformTimeFormat(startTime);
      const formattedEndTime = this.transformTimeFormat(endTime);
      return `<p begin="${formattedStartTime}" end="${formattedEndTime}" region="bottom"><span tts:color="rgba(225,225,225,225)">${subtitle}</span></p>`;
    })
    return this.setState({ result: formattedResult.join('\n') })
  }

  transformTimeFormat = (time) => {
    let [minuteOriginal, secondOriginal] = time.split(':')
    const minute = this.pad(minuteOriginal);
    const second = this.pad(secondOriginal);
    return `00:${minute}:${second}:00`;
  }

  pad = (time) => time.padStart(2, '0');

  render() {
    const { userInput, result } = this.state;
    return (
      <div className="app">
        <div className="user-input">
          <form onSubmit={this.convertToITT}>
            <label>
              <h3>Enter your subtitles:</h3>
              <textarea 
                value={userInput}
                onChange={this.handleChange}
                className="textarea"
              />
            </label>
            <input type="submit" value="Convert to ITT" className="convert-button"/>
          </form>
        </div>
        <div className="result">
          <form>
            <label>
              <h3>Result: (**you need to change the end time for the last line)</h3>
              <textarea
                value={result}
                className="textarea"
                readOnly
              />
            </label>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
