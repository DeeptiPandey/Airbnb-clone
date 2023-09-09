import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookThisPlace() {
    if (place.maxGuests && numberOfGuests > place.maxGuests) {
      // Don't allow booking if the number of guests exceeds the maximum.
      return;
    }

    const response = await axios.post("/bookings", {
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      place: place._id,
      price: numberOfNights * place.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  const handleNumberOfGuestsChange = (ev) => {
    const newValue = parseInt(ev.target.value, 10);
    if (!isNaN(newValue)) {
      // Ensure the value is greater than or equal to 0.
      setNumberOfGuests(Math.max(newValue, 0));
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} /per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex flex-col sm:flex-row">
          <div className="px-3 py-4">
            <label>Check in: </label>
            <input
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="px-3 py-4 sm:border-l sm:pl-3">
            <label>Check Out: </label>
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className="px-3 py-4 border-t">
          <label>Number of Guests: </label>
          {window.innerWidth <= 640 ? (
            <select
              value={numberOfGuests}
              onChange={handleNumberOfGuestsChange}
            >
              {[...Array(place.maxGuests + 1).keys()].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              value={numberOfGuests}
              onChange={handleNumberOfGuestsChange}
              min="0" 
            />
          )}
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <label>Phone number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
            />
          </div>
        )}
      </div>
      {user ? (
        <div>
          <button
            onClick={bookThisPlace}
            className="primary mt-4"
            disabled={redirect !== ""}
          >
            Book this place
            {numberOfNights > 0 && (
              <span> ${numberOfNights * place.price}</span>
            )}
          </button>
          {redirect && <Navigate to={redirect} />}
        </div>
      ) : (
        <p className="text-red-500 mt-4">Please Login To Book</p>
      )}
    </div>
  );
}