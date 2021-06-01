import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Media } from "react-bootstrap";
import Spinner from "../../component/Spinner";
import { getData } from "../../helpers/CRUD";

const Transaction = () => {
  const [data, setData] = useState([]);
  const [onLoad, setLoad] = useState(false);

  useEffect(() => {
    document.title = `Your Transaction - Balobe`;
    getTransaction();
  }, []);

  const getTransaction = async () => {
    setLoad(true);
    const response = await getData(`/transaction/all`);
    if (response.status === 200) {
      setData(response.data.data);
    }
    setLoad(false);
  };

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
                        src={`https://firebasestorage.googleapis.com/v0/b/balobe-d2a28.appspot.com/o/${v.image.replace(
                          "/",
                          "%2F"
                        )}?alt=media`}
                        alt="icon user"
                      />
                      <Media.Body>
                        <h3>{v.name}</h3>
                        <h5>Total Pemesanan : {v.total_item}</h5>
                        <div className="text-bold">Rp {v.total_price}</div>
                        <div className="badge badge-success">Sudah Dibayar</div>
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

export default Transaction;
