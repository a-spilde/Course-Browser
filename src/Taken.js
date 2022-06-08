import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";

import "./App.css";
import Section from "./Section";

class Taken extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ratings: ['No Rating', '1', '2', '3', '4', '5']

    };
    this.rating = React.createRef()
  }

  getRatings() {
    let ratingOptions = [];
    let r = ['No Rating','1','2','3','4','5']

    for (const rating of r) {
      ratingOptions.push(<option key={rating}> {rating} </option>);
    }

    return ratingOptions;
  }

  render() {
    
    return (
      
      <Card style={{ width: "33%", marginTop: "5px", marginBottom: "5px" }}>
        <Card.Body>
          <Card.Title>
            <div style={{ maxWidth: 250 }}>{this.props.data.name}</div>
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {this.props.data.number} - {this.getCredits()}
          </Card.Subtitle>
          {this.getDescription()}



          <Form.Group controlId="formRating">
            <Form.Label></Form.Label>
            <Form.Control
              as="select"
              ref={this.rating}
              onChange={() => this.addRating()}
            >
              {this.getRatings()}
            </Form.Control>
          </Form.Group>




        </Card.Body>

      </Card>
    );
  }

  addRating() {


    this.props.ratings({keywords: this.props.data.keywords, rank: this.rating.current.value})

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

export default Taken;
