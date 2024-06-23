import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Table } from "react-bootstrap";
import { toast } from 'react-toastify';
import { addVehicleToParkingSpot, getVehicles as getVehiclesList, removeVehicleFromParkingSpot } from "../../utils/parkingManagement";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";
import UpdateVehicle from "./UpdateVehicle";
import DeleteVehicle from "./DeleteVehicle";

const PlaceVehicle = ({ parkingSpotId, disabled }) => {

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getVehicles = async () => {
        try {
            setLoading(true);
            const vehicles = await getVehiclesList();
            setVehicles(vehicles);
        } catch (error) {
            toast(<NotificationError text="Failed to fetch Vehicles." />);
        } finally {
            setLoading(false);
        }
    }

    const handleInsertVehicle = async (vehicleId) => {
        try {
            await addVehicleToParkingSpot(parkingSpotId, vehicleId);
            toast(<NotificationSuccess text="Vehicle placed successfully." />);
        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Vehicle placement not successful." />);
        }
    }

    const handleRemoveVehicle = async (vehicleId) => {
        try {
            await removeVehicleFromParkingSpot(parkingSpotId, vehicleId);
            toast(<NotificationSuccess text="Vehicle removed successfully." />);
        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Vehicle removal not successful." />);
        }
    }

    useEffect(() => {
        getVehicles();
    }, []);

    return (
        <>
            <Button variant="primary" onClick={handleShow} disabled={!disabled}>
                Place Vehicle
            </Button>

            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Place Vehicle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Age Range</th>
                                <th>Type</th>
                                <th>Model</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map((vehicle, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{vehicle.name}</td>
                                    <td>{vehicle.ageRange}</td>
                                    <td>{vehicle.type}</td>
                                    <td>{vehicle.model}</td>
                                    <td>{vehicle.description}</td>

                                    <td>
                                        <Button
                                            variant="primary"
                                            style={{ marginRight: "2px" }}
                                            onClick={() => handleInsertVehicle(vehicle.id)}
                                        >
                                            Place
                                        </Button>
                                        <Button
                                            variant="danger"
                                            style={{ marginRight: "2px" }}
                                            onClick={() => handleRemoveVehicle(vehicle.id)}
                                        >
                                            Remove
                                        </Button>
                                        <UpdateVehicle vehicleId={vehicle.id} />
                                        <DeleteVehicle vehicleId={vehicle.id} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

PlaceVehicle.propTypes = {
    parkingSpotId: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
};

export default PlaceVehicle;
