import React from 'react';
import ReactDOM from 'react-dom';
import Separator from './Separator'
import Link from './Link'

export default class Header extends React.Component {
  render() {
    return (
      <div id="headercontainer" className="container-fluid">
        <div className="row mt-5">
          <div className="col-4">
            <Link id="home" clazz="" text="LOGO" path="/"/>
          </div>
          <div className="col-8">
            <div className="row justify-content-end">
              <div className="col-auto">
                <Link id="" clazz="" text="¿Qué medimos?" path="/docs/airquality"/>
              </div>
              <div className="col-auto">
                <Link id="" clazz="" text="¿Cómo?" path="/docs/how"/>
              </div>
              <div className="col-auto">
                <Link id="" clazz="" text="Conviertete en un nodo" path="/get-involved"/>
              </div>
              <div className="col-auto">
                <Link id="" clazz="" text="Descargas" path="/downloads"/>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Separator top="3" bottom="5"/>
          </div>
        </div>
      </div>
  );
  }
}
