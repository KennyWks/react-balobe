import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Media, Pagination } from "react-bootstrap";
import Spinner from "../../component/Spinner";
import { getData } from "../../helpers/CRUD";

const BuyTransaction = (props) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [metadata, setMetadata] = useState({});
  const [onLoad, setLoad] = useState(false);

  const getTransaction = async (url) => {
    setLoad(true);
    try {
      const response = await getData(`/transaction/buy${url ? url : ""}`);
      if (response.status === 200) {
        setData(response.data.data);
        setMetadata(response.data.metadata);
      }
    } catch (error) {
      if (!error.response) {
        alert("Server error! please try again.");
      } else {
        if (error.response.status === 500) {
          alert("Something error! please try again.");
        }
      }
    }
    setLoad(false);
  };

  useEffect(() => {
    document.title = `Your Transaction (Buy) - Balobe`;
    getTransaction(props.location.search);
  }, []);

  const handleFirstPage = () => {
    setPage(1);
    getTransaction(`?page=1&limit=5`);
  };

  const handleLastPage = () => {
    const { totalPage } = metadata.pagination;
    setPage(totalPage);
    getTransaction(`?page=${totalPage}&limit=5`);
  };

  const handlePrev = () => {
    const counter = page <= 1 ? 1 : page - 1;
    setPage(counter);
    getTransaction(`?page=${counter}&limit=5`);
  };

  const handleNext = () => {
    const { totalPage } = metadata.pagination;
    const counter = page === totalPage ? totalPage : page + 1;
    setPage(counter);
    getTransaction(`?page=${counter}&limit=5`);
  };

  const handleEllipsis = () => {
    const { currentPage } = metadata.pagination;
    const counter = Math.floor(currentPage / 5);
    setPage(counter);
    getTransaction(`?page=${counter}&limit=5`);
  };

  const paginationItem = () => {
    let pagination = [];
    for (let i = 1; i <= 5; i++) {
      pagination.push(<Pagination.Item>{i}</Pagination.Item>);
    }
    return pagination;
  };

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

            {!onLoad && !data.length > 0 && (
              <div className="text-center">Data transaction is empty.</div>
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

      {Object.keys(metadata).length > 0 && (
        <Row className="justify-content-center mt-3">
          <Pagination>
            {metadata.pagination.prevPage && (
              <>
                <Pagination.First
                  onClick={() => {
                    handleFirstPage();
                  }}
                />
                <Pagination.Prev
                  onClick={() => {
                    handlePrev();
                  }}
                />
              </>
            )}

            {metadata.pagination.currentPage - 1 >= 5 && (
              <>
                <Pagination.Ellipsis
                  onClick={() => {
                    handleEllipsis();
                  }}
                />
              </>
            )}

            <Pagination.Item active>
              {metadata.pagination.currentPage}
            </Pagination.Item>

            {metadata.pagination.totalPage - metadata.pagination.currentPage >
              5 && (
              <>
                {() => {
                  paginationItem();
                }}
              </>
            )}

            {metadata.pagination.totalPage - metadata.pagination.currentPage >=
              5 && (
              <>
                <Pagination.Ellipsis
                  onClick={() => {
                    handleEllipsis();
                  }}
                />
              </>
            )}

            {metadata.pagination.nextPage && (
              <>
                <Pagination.Next
                  onClick={() => {
                    handleNext();
                  }}
                />
                <Pagination.Last
                  onClick={() => {
                    handleLastPage();
                  }}
                />
              </>
            )}
          </Pagination>
        </Row>
      )}
    </Container>
  );
};

export default BuyTransaction;
