import React, { Component } from "react";
import { getData, postData } from "../../helpers/CRUD";
import { Link } from "react-router-dom";

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        name: "",
      },
      listCategory: {
        data: [],
        metadata: {},
      },
    };
  }

  getCategory = async () => {
    try {
      const response = await getData("/category");
      this.setState((prevState) => ({
        ...prevState,
        listCategory: response.data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.getCategory();
  }

  handleSubmt = async (e) => {
    e.preventDefault();
    try {
      const response = await postData("/category", this.state.form);
      // console.log(response);
      this.getCategory();
    } catch (error) {
      console.log(error);
    }
  };

  handleChange = async (e) => {
    const name = e.target.name;
    const hs_code = e.target.hs_code;
    const value = e.target.value;

    this.setState((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        [name]: value,
        [hs_code]: value,
      },
    }));
  };

  render() {
    const { listCategory, form } = this.state;
    return (
      <div>
        <h4>Form Category</h4>
        <form onSubmit={this.handleSubmt}>
          <input
            type="number"
            name="hs_code"
            onChange={this.handleChange}
            value={form.hs_code}
          />
          <input
            type="text"
            name="name"
            onChange={this.handleChange}
            value={form.name}
          />
          <button type="submit">Add</button>
        </form>
        <h4>List Category</h4>
        <ul>
          {listCategory.data.length > 0 &&
            listCategory.data.map((v, i) => (
              <Link to={`category/${v.id_category}`}>
                <li key={i}>
                  {v.name} | {v.hs_code}
                </li>
              </Link>
            ))}
        </ul>
      </div>
    );
  }
}

export default Category;
