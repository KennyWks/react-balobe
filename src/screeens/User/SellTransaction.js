import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Media } from "react-bootstrap";
import Spinner from "../../component/Spinner";
import { getData } from "../../helpers/CRUD";

const SellTransaction = (props) => {
  const [data, setData] = useState([]);
  const [onLoad, setLoad] = useState(false);

  const getTransaction = async () => {
    const id_pelapak = props.match.params.id;
    setLoad(true);
    try {
      const response = await getData(`/transaction/sell/${id_pelapak}`);
      if (response.status === 200) {
        setData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoad(false);
  };

  useEffect(() => {
    document.title = `Your Transaction (Sell) - Balobe`;
    getTransaction();
  }, []);

  const url =
    process.env.REACT_APP_ENVIROMENT === "production"
      ? process.env.REACT_APP_URL_IMAGES_PRODUCTION
      : process.env.REACT_APP_URL_IMAGES_DEVELOPMENT;

  return (
    <Container>
      <Row>
        <Col>
          <Card.Body>
            {onLoad && (
              <div className="text-center my-2">
                <Spinner class="text-center my-3" />
              </div>
            )}

            {!onLoad &&
              data.length > 0 &&
              data.map((v, i) => (
                <Card className="mt-2" key={i}>
                  <ul className="list-unstyled" key={i}>
                    <Media as="li">
                      <img
                        width={100}
                        height={100}
                        className="m-2 rounded"
                        // src={`${url}/${v.image.replace("/", "%2F")}?alt=media`}
                        src={`${url}/${
                          process.env.REACT_APP_ENVIROMENT === "production"
                            ? `${v.image.replace("/", "%2F")}?alt=media`
                            : v.image
                        }`}
                        alt="icon user"
                      />
                      <Media.Body>
                        <h3>{v.name}</h3>
                        <h5>
                          Total Payment - IDR{" "}
                          {parseInt(v.total_price) + parseInt(v.courier)}
                        </h5>
                        <div className="text-bold">
                          Total Order : {v.total_item}
                        </div>
                        <div className="text-bold">
                          Total Price - IDR {v.total_price}
                        </div>
                        <div className="text-bold">
                          Courier - IDR {v.courier}
                        </div>
                        <div className="badge badge-success">Payed</div>
                      </Media.Body>
                    </Media>
                  </ul>
                </Card>
              ))}
          </Card.Body>
        </Col>
      </Row>
    </Container>
  );
};

export default SellTransaction;
