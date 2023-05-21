import React from "react";
import PropTypes from "prop-types";
import theme from "../../../common/theme";

type Props = {
  onPageChange: (page: number) => void;
  totalCount: number;
  currentPage: number;
  pageLimit: number;
  className?: string;
};

export function Pagination(props: Props) {
  const totalCount = props.totalCount >= 0 ? props.totalCount : 0;
  const paginationState = calcState();

  function calcState() {
    const numOfPages = Math.ceil(totalCount / props.pageLimit);
    const pageState = [];

    pageState.push(props.currentPage);
    if (props.currentPage - 1 > 0) {
      pageState.unshift(props.currentPage - 1);
    }
    if (props.currentPage - 2 > 0) {
      pageState.unshift(props.currentPage - 2);
    }
    if (props.currentPage + 1 <= numOfPages - 1) {
      pageState.push(props.currentPage + 1);
    }
    if (props.currentPage + 2 <= numOfPages - 2) {
      pageState.push(props.currentPage + 2);
    }
    return pageState;
  }

  function displayPages() {
    return (
      <div className="Pagination">
        <ul className="listContainer">
          {paginationState.map((number) => (
            <li
              key={number}
              onClick={() => props.onPageChange(number)}
              className={
                number === props.currentPage ? "pageItem active" : "pageItem"
              }
            >
              <span>{number}</span>
            </li>
          ))}
        </ul>
        <style jsx>{`
          .Pagination {
          }
          .listContainer {
            list-style: none;
            padding: 0px;
          }
          .pageItem {
            display: inline-block;
            background-color: ${theme.colors.brandBlue};
            width: 50px;
            height: 50px;
            text-align: center;
            padding: 12px;
            margin-right: 3px;
            cursor: pointer;
          }
          .active {
            background-color: ${theme.colors.brandBlack};
            color: ${theme.colors.brandWhite};
          }
        `}</style>
      </div>
    );
  }

  if (props.totalCount) {
    return <>{displayPages()}</>;
  }

  return <div>No Results</div>;
}

Pagination.propTypes = {
  totalCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageLimit: PropTypes.number.isRequired,
  className: PropTypes.string,
  onPageChange: PropTypes.func.isRequired,
};
