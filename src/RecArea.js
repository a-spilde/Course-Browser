import React from "react";
import "./App.css";
import Rec from "./Rec";

class RecArea extends React.Component {

    getRecs() {


        let recs = [];

        if (this.props.hasData) {

            for (let i = 0; i < this.props.data.length; i++) {
                recs.push(
                    <Rec
                        key={"Rec_" + i}
                        data={this.props.data[i]}
                        recKey={this.props.data[i].number}
                        ratings={(data) => this.props.ratings(data)}
                    />
                );
            }

        }







        return recs;
    }

    shouldComponentUpdate(nextProps) {
        return JSON.stringify(this.props) !== JSON.stringify(nextProps);
    }

    render() {
        return <div style={{ margin: 5, marginTop: -5 }}>{this.getRecs()}</div>;
    }
}

export default RecArea;
