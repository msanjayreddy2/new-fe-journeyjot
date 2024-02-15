import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  useEffect(() => {
    const tmp = async () => {
      try {
        // console.log(process.env.REACT_APP_API_URL);
        const responsedata = await sendRequest(
          process.env.REACT_APP_API_URL + `/api/places/user/${userId}`
        );
        setLoadedPlaces(responsedata.places);
      } catch (er) {}
    };
    tmp();
  }, [sendRequest, userId]);
  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces(
      loadedPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
