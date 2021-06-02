import React, { Component } from "react";
import { Container, Row, Col, Media } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  MdFavoriteBorder,
  MdRateReview,
  MdAccountCircle,
  MdReceipt,
  MdLocalOffer,
} from "react-icons/md";

class Buyer extends Component {
  componentDidMount() {
    document.title = `My Transaction (Buy) - Balobe`;
  }

  render() {
    return (
      <Container>
        <Row className="mt-3">
          <Col>
            <ul className="list-unstyled">
              <Media as="li">
                <div>
                  <MdLocalOffer />
                </div>
                <div className="mx-3">
                  <Media.Body>
                    <Link to={""} style={{ textDecoration: "none" }}>
                      <h5>Your Voucher</h5>
                      <p>Check your fun voucher.</p>
                    </Link>
                  </Media.Body>
                </div>
              </Media>

              <Media as="li">
                <div>
                  <MdFavoriteBorder />
                </div>
                <div className="mx-3">
                  <Media.Body>
                    <Link to={"/"} style={{ textDecoration: "none" }}>
                      <h5>Your Favourite Items</h5>
                      <p>Buy your favourite item done collected.</p>
                    </Link>
                  </Media.Body>
                </div>
              </Media>

              <Media as="li">
                <div>
                  <MdRateReview />
                </div>
                <div className="mx-3">
                  <Media.Body>
                    <Link to={`/review`} style={{ textDecoration: "none" }}>
                      <h5>Your Review</h5>
                      <p>Check and write your review.</p>
                    </Link>
                  </Media.Body>
                </div>
              </Media>

              <Media as="li">
                <div>
                  <MdAccountCircle />
                </div>
                <div className="mx-3">
                  <Media.Body>
                    <Link
                      to={`/profil/${this.props.idUser}`}
                      style={{ textDecoration: "none" }}
                    >
                      <h5>Your Data</h5>
                      <p>Check and edit your info.</p>
                    </Link>
                  </Media.Body>
                </div>
              </Media>

              <Media as="li">
                <div>
                  <MdReceipt />
                </div>
                <div className="mx-3">
                  <Media.Body>
                    <Link
                      to={"/transaction/buy"}
                      style={{ textDecoration: "none" }}
                    >
                      <h5>Your Transaction</h5>
                      <p>Check your review transaction.</p>
                    </Link>
                  </Media.Body>
                </div>
              </Media>
            </ul>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Buyer;
