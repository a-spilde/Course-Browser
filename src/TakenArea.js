import React from "react";
import "./App.css";
import Taken from "./Taken";

class TakenArea extends React.Component {

    getTakens() {
        let takens = [];

        for (let i = 0; i < this.props.data.length; i++) {
            takens.push(
                <Taken
                    key={"taken_" + i}
                    data={this.props.data[i]}
                    takenKey={this.props.data[i].number}
                    ratings={(data) => this.props.ratings(data)}
                />
            );
        }





        return takens;
    }

    shouldComponentUpdate(nextProps) {
        return JSON.stringify(this.props) !== JSON.stringify(nextProps);
    }

    render() {
        return <div style={{ margin: 5, marginTop: -5 }}>{this.getTakens()}</div>;
    }
}

export default TakenArea;
