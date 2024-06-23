import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";
import PlaceRenterInfo from "../renter/PlaceRenterInfo";
import PlaceVehicle from "../vehicle/PlaceVehicle";

const VehicleParkingCard = ({ vehicleParking, rent }) => {
    const { id, name, state, owner, rentPrice, renter, vehicles } = vehicleParking;
    const rentPriceBigInt = BigInt(rentPrice);
    const price = (rentPriceBigInt / BigInt(10 ** 8)).toString();

    const [disabled, setDisabled] = useState(false);

    const checkState = () => {
        if (state === "reserved") {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    };

    const triggerRent = async () => {
        await rent(id);
    };

    useEffect(() => {
        checkState();
    }, [state]);

    return (
        <Col md={4} className="mb-4">
            <Card>
                <Card.Body>
                    <Card.Title>{name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{state}</Card.Subtitle>
                    <Card.Text className="d-flex align-items-center justify-content-between">
                        <Badge bg="secondary">Renter: {renter}</Badge>
                        <Badge bg="secondary" className="ml-3">
                            Rent Price: {price} ICP
                        </Badge>
                    </Card.Text>
                    <Card.Text>
                        Vehicles: {vehicles && vehicles.map((vehicle) => vehicle.name).join(", ")}
                    </Card.Text>
                    <div className="m-2 d-flex align-items-center justify-content-end">
                        <Button variant="dark" onClick={triggerRent}>
                            Rent
                        </Button>
                    </div>
                    {disabled ? (
                        <Badge bg="success">Rented</Badge>
                    ) : (
                        <Badge bg="danger">Not Rented: Rent to Enable Buttons Below </Badge>
                    )}
                    <Stack direction="horizontal" gap={2} className="mt-2">
                        <PlaceRenterInfo vehicleParkingId={id} disabled={disabled} />
                        <PlaceVehicle vehicleParkingId={id} disabled={disabled} />
                    </Stack>
                </Card.Body>
            </Card>
        </Col>
    );
};

VehicleParkingCard.propTypes = {
    vehicleParking: PropTypes.object.isRequired,
    rent: PropTypes.func.isRequired,
};

export default VehicleParkingCard;
