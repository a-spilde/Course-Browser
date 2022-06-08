import React from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import CourseArea from "./CourseArea";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import TakenArea from "./TakenArea";
import RecArea from "./RecArea";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      subjects: [],
      cartCourses: {},
      takenCourses: [],
      takenCourseData: [],
      tagsRanked: [],
      interest: [],
      hasData: null,
      cR: [],
      nonTaken: []
    };
  }

  componentDidMount() {
    this.loadInitialState();
  }

  async loadInitialState() {
    let courseURL = "http://cs571.cs.wisc.edu:53706/api/react/classes";
    let courseData = await (await fetch(courseURL)).json();

    let ccURL = "http://cs571.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed";
    let ccData = await (await fetch(ccURL)).json();

    var arr = []

    var non = courseData

    for (let i = 0; i < courseData.length; i++) {



      if (ccData.data.includes(courseData[i].number)) {

        arr.push(courseData[i]);

      }

    }

    for (let j = 0; j < ccData.data.length; j++) {

      for (let k = 0; k < non.length; k++) {

        if (non[k].number == ccData.data[j]) {

          non.splice(k, 1)

        }

      }

    }

    for (let i = 0; i < courseData.length; i++) { //iterate through all courses

      let reqs = []

      for (let j = 0; j < courseData[i].requisites.length; j++) { //iterate through course requisites

        let hit = false;

        for (let k = 0; k < courseData[i].requisites[j].length; k++) { //iterate through each requisite OR

          if (ccData.data.includes(courseData[i].requisites[j][k])) { // if taken course is found in requisite

            hit = true

          }

        }

        reqs.push(hit)

      }

      if (reqs.includes(false)) {


        courseData[i].reqs = "true"

      }
      else {

        courseData[i].reqs = "false"

      }

      

    } 



    this.setState({
      allCourses: courseData,
      filteredCourses: courseData,
      subjects: this.getSubjects(courseData),
      takenCourses: ccData,
      takenCourseData: arr,
      hasData: false,
      nonTaken: non

    });
  }


  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for (let i = 0; i < data.length; i++) {
      if (subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({ filteredCourses: courses });
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses)); // I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {
      return x.number === data.course;
    });
    if (courseIndex === -1) {
      return;
    }

    if ("subsection" in data) {
      if (data.course in this.state.cartCourses) {
        if (data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        } else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      } else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    } else if ("section" in data) {
      if (data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for (
          let i = 0;
          i <
          this.state.allCourses[courseIndex].sections[data.section].subsections
            .length;
          i++
        ) {
          newCartCourses[data.course][data.section].push(
            this.state.allCourses[courseIndex].sections[data.section]
              .subsections[i]
          );
        }
      } else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for (
          let i = 0;
          i <
          this.state.allCourses[courseIndex].sections[data.section].subsections
            .length;
          i++
        ) {
          newCartCourses[data.course][data.section].push(
            this.state.allCourses[courseIndex].sections[data.section]
              .subsections[i]
          );
        }
      }
    } else {
      newCartCourses[data.course] = {};

      for (
        let i = 0;
        i < this.state.allCourses[courseIndex].sections.length;
        i++
      ) {
        newCartCourses[data.course][i] = [];

        for (
          let c = 0;
          c < this.state.allCourses[courseIndex].sections[i].subsections.length;
          c++
        ) {
          newCartCourses[data.course][i].push(
            this.state.allCourses[courseIndex].sections[i].subsections[c]
          );
        }
      }
    }
    this.setState({ cartCourses: newCartCourses });
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses));

    if ("subsection" in data) {
      newCartCourses[data.course][data.section].forEach((_subsection) => {
        if (_subsection.number === data.subsection.number) {
          newCartCourses[data.course][data.section].splice(
            newCartCourses[data.course][data.section].indexOf(_subsection),
            1
          );
        }
      });
      if (newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if (Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    } else if ("section" in data) {
      delete newCartCourses[data.course][data.section];
      if (Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    } else {
      delete newCartCourses[data.course];
    }
    this.setState({ cartCourses: newCartCourses });
  }

  getCartData() {
    let cartData = [];

    for (const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {
        return x.number === courseKey;
      });

      cartData.push(course);
    }
    return cartData;
  }

  getRatings(arr) {


    var k = arr.keywords;
    var rank = parseInt(arr.rank);

    var setter = this.state.tagsRanked

    if (setter.length == 0) {

      for (let i = 0; i < k.length; i++) {

        let add = [k[i], 1, rank];
        setter.push(add);

      }

    }


    else {



      for (let i = 0; i < k.length; i++) { //loop through keywords already used

        let found = false;

        for (let j = 0; j < setter.length; j++) { // loop through current keywords

          if (setter[j][0] == k[i]) {

            found = true;

            let newAv1 = (setter[j][2] + rank)
            let newAv2 = (setter[j][1] + 1)


            let newAv = newAv1 / 2

            setter[j][1] += 1;
            setter[j][2] = newAv;

          }


        }

        if (!found) {

          let add = [k[i], 1, rank];
          setter.push(add);

        }

      }

    }

    this.setState({

      tagsRanked: setter

    })
    this.state.hasData = true;
    this.generateRecs();

  }

  getIA(arr) {

    this.state.interest = arr;

  }

  generateRecs() {

    var recCourses = [];


    for (let i = 0; i < this.state.nonTaken.length; i++) { //iterate through courses not taken

      let kw = this.state.nonTaken[i].keywords

      for (let j = 0; j < kw.length; j++) { //iterate through course keywords

        for (let k = 0; k < this.state.tagsRanked.length; k++) { //iterate through keywords that have been rated

          if (kw[j] == this.state.tagsRanked[k][0]) { // if a keyword is found that has been rated > 3

            let kwArr = []
            kwArr.push(kw[j])

            let toAdd = []
            toAdd.push(this.state.nonTaken[i])
            toAdd.push(this.state.tagsRanked[k][2])
            toAdd.push(kwArr)

            let found = false;

            for (let g = 0; g < recCourses.length; g++) { //iterate through courses already recommended

              if (recCourses[g][0] == toAdd[0] && recCourses[g][2].includes(kw[j])) { //if course is already recommended

                found = true;

              }
              else if (recCourses[g][0] == toAdd[0] && !recCourses[g][2].includes(kw[j])) {

                found = true
                recCourses[g][2].push(kw[j])
                recCourses[g][1] = (recCourses[g][1] + this.state.tagsRanked[k][2])/2

              }



            }

            if (!found && this.state.tagsRanked[k][2] > 3.5) {

              recCourses.push(toAdd)

            }

          }

        }

      }

    }

    var sort = recCourses
    var final = []



    var count = 0;

    while (sort.length != final.length) {
      var max = 0;
      var addInd = -1;


      for (let i = 0; i < sort.length; i++) {



        if (sort[i][1] >= max && !final.includes(sort[i][0])) {

          max = sort[i][1];
          addInd = i;

        }


      }


      sort[addInd][0].points = sort[addInd][1]

      final.push(sort[addInd][0])
    }

    this.setState({

      cR: final

    })

  }

  getRecs() {

    let rData = [];

    return this.state.cR;

  }

  render() {
    return (
      <>
        <Tabs
          defaultActiveKey="search"
          style={{
            position: "fixed",
            zIndex: 1,
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <Tab eventKey="search" title="Search" style={{ paddingTop: "5vh" }}>
            <Sidebar
              setCourses={(courses) => this.setCourses(courses)}
              courses={this.state.allCourses}
              subjects={this.state.subjects}
              IA={(data) => this.getIA(data)}
            />
            <div style={{ marginLeft: "20vw" }}>
              <CourseArea
                data={this.state.filteredCourses}
                cartMode={false}
                addCartCourse={(data) => this.addCartCourse(data)}
                removeCartCourse={(data) => this.removeCartCourse(data)}
                cartCourses={this.state.cartCourses}
              />
            </div>
          </Tab>
          <Tab eventKey="cart" title="Cart" style={{ paddingTop: "5vh" }}>
            <div style={{ marginLeft: "20vw" }}>
              <CourseArea
                data={this.getCartData()}
                cartMode={true}
                addCartCourse={(data) => this.addCartCourse(data)}
                removeCartCourse={(data) => this.removeCartCourse(data)}
                cartCourses={this.state.cartCourses}
              />
            </div>
          </Tab>
          <Tab eventKey="taken" title="Completed Courses" style={{ paddingTop: "5vh" }}>
            <div style={{ marginLeft: "20vw" }}>
              <TakenArea
                data={this.state.takenCourseData}
                ratings={(data) => this.getRatings(data)}
              />
            </div>
          </Tab>
          <Tab eventKey="recs" title="Recommended Courses" style={{ paddingTop: "5vh" }}>
            <div style={{ marginLeft: "20vw" }}>
              <RecArea
                data={this.getRecs()}
                hasData={this.state.hasData}
              />
            </div>
          </Tab>
        </Tabs>
      </>
    );
  }
}

export default App;

