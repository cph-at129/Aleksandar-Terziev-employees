import React, {Component} from 'react';
import './Employees.css'

class Employees extends Component {

    state = {
        result: null,
        fileChoosen: 'No file chosen...'
    }

    findEmployees = (data) => {
        let result = null
        // map employees and format dates
        let employees = data.split('\n').map(line => {
            const records = line.split(',') //split data by comma
            const employeeID = records[0]
            if (!employeeID) return null; //if no employee id skip
            const projectID = records[1].trim()
            const from = new Date(records[2].trim())
            let to = new Date(records[3].trim())
            if (records[3].trim() === 'NULL') to = new Date() // if date is null, set it to now
            return {
                employeeId: employeeID.trim(),
                projectId: projectID.trim(),
                period: to.getTime() - from.getTime(), //calculate period
                days: (to - from) / (1000 * 60 * 60 * 24) //calculate days
            }
        })
        employees = employees.filter(e => e !== null) // filter empty lines
        employees.sort((a, b) => a.period < b.period ? 1 : -1) // sort by period

        // find the first two employees working the longest period on a project
        first_loop:
            for (let i = 0; i < employees.length - 1; i++) {
                const firstProjectId = employees[i].projectId
                for (let j = 1; j < employees.length - 1; j++) {
                    const nextProjectId = employees[j].projectId
                    if (firstProjectId === nextProjectId) {
                        result = [employees[i], employees[j]]
                        break first_loop;
                    }
                }
            }
        this.setState({result})
    }

    // read the file
    readFile = (e) => {
        const file = e.target.files[0]
        if(file.name.split('.')[1] !== 'txt') {
            console.log("Expected file format is txt!")
            return;
        }
        const fileReader = new FileReader();
        fileReader.onloadend = (e) => {
            const content = fileReader.result
            console.log(content)
            this.findEmployees(content)
            this.setState({fileChoosen: file.name})
        }
        fileReader.readAsText(file)
    }

    renderEmployees = () => {
        if(!this.state.result) return null;
        const firstItem = this.state.result[0]
        const secondItem = this.state.result[1]
        const firstEmployee = firstItem ? firstItem.employeeId : 'Not Found'
        const secondEmployee = secondItem ? secondItem.employeeId : 'Not Found'
        const projectId = firstItem ? firstItem.projectId : 'Not Found'
        let daysWorked = 'Not Found'
        if(firstItem && secondItem) {
            daysWorked = Math.round(firstItem.days + secondItem.days)
        }
        return (
            <table border="1" cellPadding="5">
                <thead>
                <tr>
                    <th>Employee ID #1</th>
                    <th>Employee ID #2</th>
                    <th>Project ID</th>
                    <th>days</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{firstEmployee}</td>
                    <td>{secondEmployee}</td>
                    <td>{projectId}</td>
                    <td>{daysWorked}</td>
                </tr>
                </tbody>
            </table>
        )
    }

    render() {

        return (
            <div className="employees">
                <div className="file-upload">
                    <div className="file-select">
                        <div className="file-select-button" id="fileName">Choose Employees File</div>
                        <div className="file-select-name" id="noFile">{ this.state.fileChoosen }</div>
                        <input type="file"
                               accept=".txt"
                               className="employees-file"
                               onChange={this.readFile}
                               id="chooseFile" />
                    </div>
                </div>
                {this.renderEmployees()}
            </div>
        )
    }
}

export default Employees