import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

const FormSearch = (props) => {
  return (
    <div>
      <form method="get" action={props.path}>
        <div className="input-group mb-0">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            name="q"
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
          <div className="input-group-append">
            <button type="submit" className="btn btn-outline-primary">
              <AiOutlineSearch />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormSearch;
