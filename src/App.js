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
    const formattedByTimeStamps = this.formatByTimeStamps(subtitleByLine);
    return this.formatForITT(formattedByTimeStamps);
  }

  convertToBCC = (event) => {
    event.preventDefault();
    const { userInput } = this.state;
    const subtitleByLine = this.splitLines(userInput).map(line => line.trim());
    const bccObj = subtitleByLine.map(line => {
      //extract start & end timing
      const startAndEndTime = this.extractTiming(line);
      const [start, end] = startAndEndTime;
      const startInSeconds = this.convertTimeToSeconds(start).toFixed(2);
      const endInSeconds = this.convertTimeToSeconds(end).toFixed(2);
      //extract subtitle text
      const subtitle = this.extractSubtitle(line);
      return `{"from":${startInSeconds}, "to":${endInSeconds}, "location":2, "content":"${subtitle}" }`
    })
    this.setState({ result: bccObj })
  }

  splitLines = (userInput) => {
    return userInput.split('\n').filter(line => line !== '')
  }

  formatByTimeStamps = (inputArray) => {
    return inputArray.map(line => line.split('|')).map(line => line.map(str => str.trim()))
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

  extractTiming = (input) => {
      return input.match(/([0-9]{2}:[0-9]{2}:[0-9]{2}:[0-9]{2})/g)
  }

  convertTimeToSeconds = (hms) => {
    const [hh, mm, ss, ms] = hms.split(':');
    return (parseInt(hh) * 60 * 60) + (parseInt(mm) * 60) + parseInt(ss) + (parseInt(ms) / 60);
  }

  extractSubtitle = (input) => {
    return input.match(/255\)\">(.*?)<\/span>/)[1]
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
            <button type="submit" className="convert-button">CONVERT SHORTHAND TO ITT</button>
            <button type="button" onClick={this.convertToBCC} className="convert-button">CONVERT ITT TO BCC</button>
          </form> 
        </div>
        <div className="result">
    
            <label>
              <h3>Result: (**you need to change the end time for the last line)</h3>
              <textarea
                value={result}
                className="textarea"
                readOnly
              />
            </label>
         
        </div>
      </div>
    );
  }
}

export default App;
