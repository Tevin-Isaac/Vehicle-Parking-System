import React from 'react';
import { toast } from 'react-toastify';
import { Button, Modal } from 'react-bootstrap';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';
import { deleteVehicleParking } from '../../utils/vehicleRentTrack';

const DeleteVehicleParking = ({ parkingId }) => {
    const discardVehicleParking = async () => {
        try {
            await deleteVehicleParking(parkingId);
            toast(<NotificationSuccess text="Vehicle Parking deleted successfully." />);
            window.location.reload(); // Reload the page after deletion (this can be improved in a real-world app)
        } catch (error) {
            console.error(error);
            toast(<NotificationError text="Failed to delete Vehicle Parking." />);
        }
    };

    return (
        <Button
            variant="danger"
            className="rounded-pill px-0"
            style={{ width: "38px" }}
            onClick={() => {
                discardVehicleParking();
            }}
        >
            <i className="bi bi-trash"></i>
        </Button>
    );
};

export default DeleteVehicleParking;
