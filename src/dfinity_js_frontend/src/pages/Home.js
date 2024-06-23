import React from 'react'
import { createVehicle, createvehicleParking, createRenter, getVehicle as getVehicleList,
     getVehicleParking as getVehicleParkingList, getRenters as getRentersList, rentPayVehicleParking } from '../utils/vehicleRent';
import { NotificationError, NotificationSuccess } from '../components/utils/Notifications';
import { toast } from 'react-toastify';
import AddVehicle from '../components/vehicle/AddVehicle';
import AddVehicleParking from '../components/vehicleSect/AddVehicleParking';
import AddRenter from '../components/renter/AddRenter';
import VehicleParkingCard from '../components/vehicleSect/VehicleParkingCard';
import {Row } from 'react-bootstrap';
import Loader from '../components/utils/Loader';

const Home = () => {

    const [vehicleParkings, setVehicleParkings] = React.useState([]);
    const [vehicles, setVehicles] = React.useState([]);
    const [renters, setRenters] = React.useState([]);

    const [loading, setLoading] = React.useState(false);

    const getvehicleParkings = async () => {
        try {
          setLoading(true);
          const vehicleParkings = await getvehicleParkingsList();
          setVehicleParkings(vehicleParkings);
        } catch (error) {
          toast(<NotificationError text="Failed to fetch vehicle Parkings." />);
        } finally {
          setLoading(false);
        }
      }

    const getVehicles = async () => {
        try {
            setLoading(true);
            const vehicles = await getVehicles();
            setVehicles(vehicles);
        } catch (error) {
            toast(<NotificationError text="Failed to fetch Vehicles." />);
        } finally {
            setLoading(false);
        }
    }

    const getRenters = async () => {
        try {
            setLoading(true);
            const renters = await getRentersList();
            setRenters(renters);
        } catch (error) {
            toast(<NotificationError text="Failed to fetch Renters." />);
        } finally {
            setLoading(false);
        }
    }



    const addRenter = async (name) => {
        try {
            setLoading(true);
            createRenter(name).then(()=>{
                getRenters();
            })
            toast(<NotificationSuccess text="Renter added successfully." />);
        } catch (error) {
            console.log({error});
            toast(<NotificationError text="Failed to create a Renter." />);
        } finally {
            setLoading(false)
        }
    }


    const addVehiclePark = async (data) => {
        try {
          setLoading(true);
          const priceStr =data.rentPrice;
          data.rentPrice = parseInt(priceStr, 10) * 1000000000;
          setVehicleParkings(data).then(()=>{
            getvehicleParkings();
        })
          toast(<NotificationSuccess text="Vehicle Parking added successfully." />);
        } catch (error) {
          console.log({error});
          toast(<NotificationError text="Failed to create a Vehicle Parking." />);
        } finally {
          setLoading(false)
        }
    }


    const addVehicle = async (data) => {
        try {
          setLoading(true);
          createVehicle(data).then(()=>{
            getVehicles();
        })
          toast(<NotificationSuccess text="Vehicle added successfully." />);
        } catch (error) {
          console.log({error});
          toast(<NotificationError text="Failed to create a Vehicle." />);
        } finally {
          setLoading(false)
        }
    }


    const buy = async (id) => {
        try {
          setLoading(true);
          await rentPayVehicleParking({
            id
          }).then(async (resp) => {
            await getvehicleParkings();
            toast(<NotificationSuccess text="Vehicle Section Rented successfully" />);
          });
        } catch (error) {
          toast(<NotificationError text="Failed to Rent Vehicle Section. You need to have Enough ICP tokens in wallet." />);
        } finally {
          setLoading(false);
        }
      };

    React.useEffect(() => {
        getvehicleParkings();
        getVehicles();
        getRenters();
      }, []);
  
    return (
        <>
      {!loading ? (

        <>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fs-4 fw-bold mb-0">Vehicle Rent </h1>
                <div className="d-flex align-items-center gap-3">
                    <AddVehicle save={addVehicle} />
                    <addVehiclePark save={addVehiclePark} />
                    <AddRenter save={addRenter} />
                </div>
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5 mt-4">
                { vehicleParkings.map((vehiclePark) => (
                    <vehiclePark key={vehiclePark.id} vehiclePark={{...vehiclePark}} rent={buy} />
                ))}
            </Row>

        
        </>
        ) : (
            <Loader /> 
         )} 
        </>
    )
}

export default Home