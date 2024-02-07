import React, { Component } from "react";
import { getData } from "../../helpers/CRUD";
import { Link } from "react-router-dom";
import { Row, Col, Card, Pagination } from "react-bootstrap";
import { BsStarFill } from "react-icons/bs";
import { Footer } from "../Layout/Templates";
import Header from "../Layout/Templates";
import bodyProduct from "../../assets/css/styleCustom.module.css";
import Spinner from "../../component/Spinner";
import Cards from "../../component/Cards";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listProduct: {
        data_products: [],
        metadata_products: {},
      },
      listArticle: {
        data_articles: [],
        metadata_articles: {},
      },
      page: 1,
      onLoad: true,
    };
  }

  componentDidMount() {
    document.title = `Home - Balobe`;
    this.getProduct(this.props.location.search);
  }

  getProduct = async (url) => {
    this.setState((prevState) => ({
      ...prevState,
      onLoad: true,
    }));
    try {
      const response_products = await getData(`/item${url ? url : ""}`);
      const response_articles = await getData(`/article${url ? url : ""}`);

      this.setState((prevState) => ({
        ...prevState,
        listProduct: {
          ...prevState.listProduct,
          data_products: response_products.data.data,
          metadata_products: response_products.data.metadata.pagination,
        },
      }));

      this.setState((prevState) => ({
        ...prevState,
        listArticle: {
          ...prevState.listArticle,
          data_articles: response_articles.data.data,
          metadata_articles: response_articles.data.metadata.pagination,
        },
      }));
    } catch (error) {
      if (!error.response) {
        alert("Server error! please try again.");
      } else {
        if (error.response.status === 500) {
          alert("Something error! please try again.");
        }
      }
    }
    this.setState((prevState) => ({
      ...prevState,
      onLoad: false,
    }));
  };

  handleStarRating = (rating) => {
    let star = [];
    for (let i = 0; i < rating; i++) {
      star.push(<BsStarFill key={i} />);
    }
    return star;
  };

  handleFirstPage = () => {
    this.setState((prevState) => ({
      ...prevState,
      page: 1,
    }));
    this.getProduct(`?page=1&limit=8`);
  };

  handleLastPage = () => {
    const { totalPage } = this.state.listProduct.metadata;
    this.setState((prevState) => ({
      ...prevState,
      page: totalPage,
    }));
    this.getProduct(`?page=${totalPage}&limit=8`);
  };

  handlePrev = () => {
    const counter = this.state.page <= 1 ? 1 : this.state.page - 1;
    this.setState((prevState) => ({
      ...prevState,
      page: counter,
    }));
    this.getProduct(`?page=${counter}&limit=8`);
  };

  handleNext = () => {
    const { totalPage } = this.state.listProduct.metadata;
    const counter =
      this.state.page === totalPage ? totalPage : this.state.page + 1;

    this.setState((prevState) => ({
      ...prevState,
      page: counter,
    }));
    this.getProduct(`?page=${counter}&limit=8`);
  };

  handleEllipsis = () => {
    const { currentPage } = this.state.listProduct.metadata;
    const counter = Math.floor(currentPage / 8);
    this.setState((prevState) => ({
      ...prevState,
      page: counter,
    }));
    this.getProduct(`?page=${counter}&limit=8`);
  };

  paginationItem = () => {
    let pagination = [];
    for (let i = 1; i <= 8; i++) {
      pagination.push(<Pagination.Item>{i}</Pagination.Item>);
    }
    return pagination;
  };

  render() {
    const { data_products, metadata_products } = this.state.listProduct;
    const { data_articles, metadata_articles } = this.state.listArticle;
    const { onLoad } = this.state;
    const url =
      process.env.REACT_APP_ENVIROMENT === "production"
        ? process.env.REACT_APP_URL_IMAGES_PRODUCTION
        : process.env.REACT_APP_URL_IMAGES_DEVELOPMENT;
    return (
      <div>
        <Header />
        <Cards />

        {onLoad && <Spinner class="text-center my-3" />}

        <Row className="mt-4 mx-2">
          <Col>
            <h1>All Products</h1>
            <Row className="mt-4 mx-2">
              {!onLoad && !data_products.length > 0 && (
                <p className="text-center mt-5">Items is empty</p>
              )}

              {data_products.length > 0 &&
                data_products.map((v, i) => (
                  <Col md={3} key={i}>
                    <Card
                      style={{
                        boxShadow:
                          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                      }}
                      className="my-1"
                    >
                      <Link
                        to={`item/${v.id_item}`}
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        <Card.Img
                          variant="top"
                          src={`${url}/${
                            process.env.REACT_APP_ENVIROMENT === "production"
                              ? `${v.image.replace("/", "%2F")}?alt=media`
                              : v.image
                          }`}
                        />
                        <Card.Body className={bodyProduct.productBody}>
                          <div
                            style={{
                              fontFamily: "Hind Madurai, sans-serif",
                              style: "normal",
                              weight: 400,
                              size: "14px",
                              lineHeight: "21px",
                              color: "#141414",
                            }}
                          >
                            {v.name}
                          </div>
                          <Row>
                            <Col md={6}>
                              <div
                                style={{
                                  fontFamily: "Hind Madurai, sans-serif",
                                  style: "normal",
                                  weight: 600,
                                  size: "20px",
                                  lineHeight: "24px",
                                  color: "#141414",
                                }}
                              >
                                IDR {v.price}
                              </div>
                            </Col>
                            <Col className="text-right" md={6}>
                              <small className="text-bold">
                                {v.rating === null ? (
                                  "Not Rating"
                                ) : (
                                  <div style={{ color: "yellow" }}>
                                    {this.handleStarRating(v.rating)}
                                  </div>
                                )}
                              </small>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Link>
                    </Card>
                  </Col>
                ))}
            </Row>
            {data_products.length < 0 && <div>Items is empty</div>}

            {Object.keys(metadata_products).length > 0 && (
              <Row className="justify-content-center mt-3">
                <Pagination>
                  {metadata_products.prevPage && (
                    <>
                      <Pagination.First onClick={this.handleFirstPage} />
                      <Pagination.Prev onClick={this.handlePrev} />
                    </>
                  )}

                  {metadata_products.currentPage - 1 >= 8 && (
                    <>
                      <Pagination.Ellipsis onClick={this.handleEllipsis} />
                    </>
                  )}

                  <Pagination.Item active>
                    {metadata_products.currentPage}
                  </Pagination.Item>

                  {metadata_products.totalPage - metadata_products.currentPage >
                    8 && <>{this.paginationItem}</>}

                  {metadata_products.totalPage -
                    metadata_products.currentPage >=
                    8 && (
                    <>
                      <Pagination.Ellipsis onClick={this.handleEllipsis} />
                    </>
                  )}

                  {metadata_products.nextPage && (
                    <>
                      <Pagination.Next onClick={this.handleNext} />
                      <Pagination.Last onClick={this.handleLastPage} />
                    </>
                  )}
                </Pagination>
              </Row>
            )}
          </Col>
        </Row>

        <Row className="mt-4 mx-2">
          <Col>
            <h1>All Articles</h1>
            <Row className="mt-4 mx-2">
              {!onLoad && !data_articles.length > 0 && (
                <p className="text-center mt-5">Articles is empty</p>
              )}

              {data_articles.length > 0 &&
                data_articles.map((v, i) => (
                  <Col md={3} key={i}>
                    <Card
                      style={{
                        boxShadow:
                          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                      }}
                      className="my-1"
                    >
                      <Link
                        to={{
                          pathname: `article/${v.id_article}`,
                          state: {
                            article_name: v.article_name,
                            category_name: v.category_name,
                            description: v.description,
                            image: `${url}/${
                              process.env.REACT_APP_ENVIROMENT === "production"
                                ? `${v.image.replace("/", "%2F")}?alt=media`
                                : v.image
                            }`,
                          },
                        }}
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        <Card.Img
                          variant="top"
                          src={`${url}/${
                            process.env.REACT_APP_ENVIROMENT === "production"
                              ? `${v.image.replace("/", "%2F")}?alt=media`
                              : v.image
                          }`}
                        />
                        <Card.Body className={bodyProduct.productBody}>
                          <div
                            style={{
                              fontFamily: "Hind Madurai, sans-serif",
                              style: "normal",
                              weight: 400,
                              size: "14px",
                              lineHeight: "21px",
                              color: "#141414",
                            }}
                          >
                            {v.article_name}
                          </div>
                          <Row>
                            <Col md={6}>
                              <div
                                style={{
                                  fontFamily: "Hind Madurai, sans-serif",
                                  style: "normal",
                                  weight: 600,
                                  size: "20px",
                                  lineHeight: "24px",
                                  color: "#141414",
                                }}
                              >
                                {v.category_name}
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Link>
                    </Card>
                  </Col>
                ))}
            </Row>

            {data_articles.length < 0 && <div>Articles is empty</div>}

            {Object.keys(metadata_articles).length > 0 && (
              <Row className="justify-content-center mt-3">
                <Pagination>
                  {metadata_articles.prevPage && (
                    <>
                      <Pagination.First onClick={this.handleFirstPage} />
                      <Pagination.Prev onClick={this.handlePrev} />
                    </>
                  )}

                  {metadata_articles.currentPage - 1 >= 8 && (
                    <>
                      <Pagination.Ellipsis onClick={this.handleEllipsis} />
                    </>
                  )}

                  <Pagination.Item active>
                    {metadata_articles.currentPage}
                  </Pagination.Item>

                  {metadata_articles.totalPage - metadata_articles.currentPage >
                    8 && <>{this.paginationItem}</>}

                  {metadata_articles.totalPage -
                    metadata_articles.currentPage >=
                    8 && (
                    <>
                      <Pagination.Ellipsis onClick={this.handleEllipsis} />
                    </>
                  )}

                  {metadata_articles.nextPage && (
                    <>
                      <Pagination.Next onClick={this.handleNext} />
                      <Pagination.Last onClick={this.handleLastPage} />
                    </>
                  )}
                </Pagination>
              </Row>
            )}
          </Col>
        </Row>

        <Footer />
      </div>
    );
  }
}

export default Home;
