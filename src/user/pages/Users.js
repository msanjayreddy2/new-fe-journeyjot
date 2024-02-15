import React, { useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
  const [LoadedUsers, setLoadedUsers] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  useEffect(() => {
    const fetchusers = async () => {
      try {
        const response = await sendRequest(
          process.env.REACT_APP_API_URL + "/api/users"
        );
        console.log(response);
        if (response && response.users) {
          setLoadedUsers(response.users);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchusers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onclear={clearError}></ErrorModal>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && LoadedUsers && <UsersList items={LoadedUsers} />}
    </>
  );
};

export default Users;
