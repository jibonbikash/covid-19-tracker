import React from "react";
import './Table.css';

const Table = ({countries}) => {
    return (
        <div className={"table"}>

            {countries.map(({country, cases}, index) => (
                <tr key={index}>
                    <td>{country}</td>
                    <td>{cases}</td>
                </tr>
            ))}

        </div>
    );
}

export default Table;