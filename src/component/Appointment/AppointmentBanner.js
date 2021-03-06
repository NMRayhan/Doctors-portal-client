import React, { useEffect, useState } from "react";
import bg from "../../assets/images/bg.png";
import chair from "../../assets/images/chair.png";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import Service from "./Service";
import Slot from "./Slot";
import BookingModal from "./BookingModal";

const AppointmentBanner = () => {
  const [selected, setSelected] = useState(new Date());
  const [Services, setServices] = useState([]);
  const [ServiceSelected, setServiceSelected] = useState("Cosmetic Dentistry");
  const [ServiceSelected_id, setServiceSelected_id] = useState('');
  const [Treatment, setTreatment] = useState(null)
  const [slot, setSlot] = useState([]);
  let footer = <p>Please pick a day.</p>;
  const formatted = format(selected, "PPPP")
  if (selected) {
    footer = <p>You picked {format(selected, "PPPP")}.</p>;
  }

  useEffect(() => {
    fetch(`http://localhost:5000/services`)
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
      });
  }, []);

  const HandleSelectService = (id) => {
    const select = Services.find((service) => service._id === id);
    setServiceSelected(select.serviceName);
    setServiceSelected_id(select._id)
    setSlot(select.slot);
  };

  return (
    <>
      <div
        className="hero min-h-screen bg-no-repeat bg-center mb-9"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img src={chair} className="max-w-sm rounded-lg shadow-2xl" alt="" />
          <div className="">
            <DayPicker
              mode="single"
              fromYear={2022}
              toYear={2025}
              captionLayout="dropdown"
              selected={selected}
              onSelect={setSelected}
              footer={footer}
            />
          </div>
        </div>
      </div>
      <div>
        <div className="my-10">
          <h5 className="text-secondary text-center font-semibold text-2xl mb-5">
            Available Services on {formatted}
          </h5>
          <h5
            className="text-center font-normal text-xl"
            style={{ color: "#939393" }}
          >
            Please select a service.
          </h5>
        </div>
        <div className="px-12 my-5">
          <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center">
            {Services.map((service) => (
              <Service
                key={service._id}
                details={service}
                HandleSelectService={HandleSelectService}
              />
            ))}
          </div>
        </div>

        <div className="px-12 my-5">
          <h2 className="text-secondary text-center font-semibold text-3xl my-10">
            Available slots for {ServiceSelected}
          </h2>
            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center">
              {
                  slot.map((time, i) => <Slot key={i} details={time} ServiceSelected={ServiceSelected} setTreatment={setTreatment}></Slot>)
              }
            </div>
        </div>
        {
            Treatment && <BookingModal Treatment={Treatment} ServiceSelected_id={ServiceSelected_id} AppointDate = {formatted} setTreatment={setTreatment}></BookingModal> 
        }
      </div>
    </>
  );
};

export default AppointmentBanner;
