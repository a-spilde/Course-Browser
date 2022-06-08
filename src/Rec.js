import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";

import "./App.css";
import Section from "./Section";

class Rec extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ratings: ['No Rating', '1', '2', '3', '4', '5']

    };
    this.rating = React.createRef()
  }

  render() {

    
    return (
      
      <Card style={{ width: "33%", marginTop: "5px", marginBottom: "5px" }}>
        <Card.Body>
          <Card.Title>
            <div style={{ maxWidth: 250 }}>{this.props.data.name}</div>
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {this.props.data.number} - {this.getCredits()} - {this.props.data.points}
          </Card.Subtitle>
          {this.getDescription()}
          

        </Card.Body>

      </Card>
    );
  }


  getDescription() {
    if (this.state.expanded) {
      return <div>{this.props.data.description}</div>;
    }
  }

  getCredits() {
    if (this.props.data.credits === 1) return "1 credit";
    else return this.props.data.credits + " credits";
  }
}

export default Rec;
