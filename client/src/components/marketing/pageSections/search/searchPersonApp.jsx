import React from "react";
import SearchPerson from "./searchPerson";
import  './searchBody.css'

const SearchPersonApp = () => {

    return(
      <div className="App-contentPerson">
        <SearchPerson/>
        <SearchPerson/>
        <SearchPerson/>
      </div>
    )
}
export default SearchPersonApp;