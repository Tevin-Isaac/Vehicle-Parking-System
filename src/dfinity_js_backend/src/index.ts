import { query, update, text, Record, StableBTreeMap, Variant, Vec, None, Some, Ok, Err, ic, Principal, Opt, nat64, Duration, Result, bool, Canister } from "azle";
import {
    Ledger, binaryAddressFromAddress, binaryAddressFromPrincipal, hexAddressFromPrincipal
} from "azle/canisters/ledger";
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";

const Vehicle = Record({
    id: text,
    licensePlate: text,
    make: text,
    model: text,
    color: text,
    description: text,
});

const ParkingSpot = Record({
    id: text,
    name: text,
    state: text,
    owner: Principal,
    rentPrice: nat64,
    renter: Opt(text),
    vehicles: Vec(Vehicle),
});

const ParkingRenter = Record({
    id: text,
    name: text,
    renter: Principal,
});

const VehiclePayload = Record({
    licensePlate: text,
    make: text,
    model: text,
    color: text,
    description: text,
});

const ParkingSpotPayload = Record({
    name: text,
    rentPrice: nat64,
});

const ReserveStatus = Variant({
    PaymentPending: text,
    Completed: text
});

const Reserve = Record({
    parkingSpotId: text,
    price: nat64,
    status: ReserveStatus,
    reservor: Principal,
    paid_at_block: Opt(nat64),
    memo: nat64
});

const Message = Variant({
    NotFound: text,
    InvalidPayload: text,
    PaymentFailed: text,
    PaymentCompleted: text
});

const vehicleStorage = StableBTreeMap(0, text, Vehicle);
const parkingStorage = StableBTreeMap(1, text, ParkingSpot);
const renterStorage = StableBTreeMap(2, text, ParkingRenter);
const persistedReserves = StableBTreeMap(3, Principal, Reserve);
const pendingReserves = StableBTreeMap(4, nat64, Reserve);

const TIMEOUT_PERIOD = 3600n; // reservation period in seconds

const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

export default Canister({
    getVehicles: query([], Vec(Vehicle), () => {
        return vehicleStorage.values();
    }),

    getVehicle: query([text], Result(Vehicle, Message), (id) => {
        const vehicleOpt = vehicleStorage.get(id);
        if ("None" in vehicleOpt) {
            return Err({ NotFound: `Vehicle with id=${id} not found` });
        }
        return Ok(vehicleOpt.Some);
    }),

    getParkingSpotVehicles: query([text], Vec(Vehicle), (id) => {
        const parkingSpotOpt = parkingStorage.get(id);
        if ("None" in parkingSpotOpt) {
            return [];
        }
        return parkingSpotOpt.Some.vehicles;
    }),

    getParkingSpots: query([], Vec(ParkingSpot), () => {
        return parkingStorage.values();
    }),

    getParkingSpot: query([text], Result(ParkingSpot, Message), (id) => {
        const parkingSpotOpt = parkingStorage.get(id);
        if ("None" in parkingSpotOpt) {
            return Err({ NotFound: `Parking spot with id=${id} not found` });
        }
        return Ok(parkingSpotOpt.Some);
    }),

    getRenters: query([], Vec(ParkingRenter), () => {
        return renterStorage.values();
    }),

    getRenter: query([text], Result(ParkingRenter, Message), (id) => {
        const renterOpt = renterStorage.get(id);
        if ("None" in renterOpt) {
            return Err({ NotFound: `Renter with id=${id} not found` });
        }
        return Ok(renterOpt.Some);
    }),

    addVehicle: update([VehiclePayload], Result(Vehicle, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
            return Err({ InvalidPayload: "invalid payload" });
        }
        const vehicle = { id: uuidv4(), ...payload };
        vehicleStorage.insert(vehicle.id, vehicle);
        return Ok(vehicle);
    }),

    addVehicleToParkingSpot: update([text, text], Result(Vehicle, Message), (parkingSpotId, vehicleId) => {
        const parkingSpotOpt = parkingStorage.get(parkingSpotId);
        if ("None" in parkingSpotOpt) {
            return Err({ NotFound: `cannot add vehicle to parking spot: parking spot with id=${parkingSpotId} not found` });
        }
        const vehicleOpt = vehicleStorage.get(vehicleId);
        if ("None" in vehicleOpt) {
            return Err({ NotFound: `cannot add vehicle to parking spot: vehicle with id=${vehicleId} not found` });
        }
        const parkingSpot = parkingSpotOpt.Some;
        parkingSpot.vehicles.push(vehicleOpt.Some);
        parkingStorage.insert(parkingSpotId, parkingSpot);
        return Ok(vehicleOpt.Some);
    }),

    removeVehicleFromParkingSpot: update([text, text], Result(Vehicle, Message), (parkingSpotId, vehicleId) => {
        const parkingSpotOpt = parkingStorage.get(parkingSpotId);
        if ("None" in parkingSpotOpt) {
            return Err({ NotFound: `cannot remove vehicle from parking spot: parking spot with id=${parkingSpotId} not found` });
        }

        const parkingSpot = parkingSpotOpt.Some;
        for (let i = 0; i < parkingSpot.vehicles.length; i++) {
            if (parkingSpot.vehicles[i].id === vehicleId) {
                const removedVehicle = parkingSpot.vehicles.splice(i, 1)[0];
                parkingStorage.insert(parkingSpotId, parkingSpot);
                return Ok(removedVehicle);
            }
        }
        return Err({ NotFound: `cannot remove vehicle from parking spot: vehicle with id=${vehicleId} not found in parking spot with id=${parkingSpotId}` });
    }),

    addParkingSpot: update([ParkingSpotPayload], Result(ParkingSpot, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
            return Err({ InvalidPayload: "invalid payload" });
        }
        const parkingSpot = { id: uuidv4(), owner: ic.caller(), state: "open", renter: None, vehicles: [], ...payload };
        parkingStorage.insert(parkingSpot.id, parkingSpot);
        return Ok(parkingSpot);
    }),

    addRenter: update([text], Result(ParkingRenter, Message), (name) => {
        const renter = { id: uuidv4(), name: name, renter: ic.caller() };
        renterStorage.insert(renter.id, renter);
        return Ok(renter);
    }),

    rentParkingSpot: update([text, text], Result(ParkingSpot, Message), (renterId, parkingSpotId) => {
        const renterOpt = renterStorage.get(renterId);
        if ("None" in renterOpt) {
            return Err({ NotFound: `cannot rent parking spot: renter with id=${renterId} not found` });
        }
        const parkingSpotOpt = parkingStorage.get(parkingSpotId);
        if ("None" in parkingSpotOpt) {
            return Err({ NotFound: `cannot rent parking spot: parking spot with id=${parkingSpotId} not found` });
        }

        const renterName = renterOpt.Some.name;
        parkingSpotOpt.Some.renter = Some(renterName);
        parkingStorage.insert(parkingSpotId, parkingSpotOpt.Some);
        return Ok(parkingSpotOpt.Some);
    }),

    returnParkingSpot: update([text], Result(ParkingSpot, Message), (parkingSpotId) => {
        const parkingSpotOpt = parkingStorage.get(parkingSpotId);
        if ("None" in parkingSpotOpt) {
            return Err({ NotFound: `cannot return parking spot: parking spot with id=${parkingSpotId} not found` });
        }
        if (parkingSpotOpt.Some.renter === None) {
            return Err({ NotFound: `cannot return parking spot: parking spot with id=${parkingSpotId} not rented` });
        }
        parkingSpotOpt.Some.renter = None;
        parkingStorage.insert(parkingSpotId, parkingSpotOpt.Some);
        return Ok(parkingSpotOpt.Some);
    }),

    updateVehicle: update([Vehicle], Result(Vehicle, Message), (payload) => {
        const vehicleOpt = vehicleStorage.get(payload.id);
        if ("None" in vehicleOpt) {
            return Err({ NotFound: `cannot update the vehicle: vehicle with id=${payload.id} not found` });
        }
        vehicleStorage.insert(vehicleOpt.Some.id, payload);
        return Ok(payload);
    }),

    updateParkingSpot: update([ParkingSpot], Result(ParkingSpot, Message), (payload) => {
        const parkingSpotOpt = parkingStorage.get(payload.id);
        if ("None" in parkingSpotOpt) {
            return Err({ NotFound: `cannot update the parking spot: parking spot with id=${payload.id} not found` });
        }
        parkingStorage.insert(parkingSpotOpt.Some.id, payload);
        return Ok(payload);
    }),

    updateRenter: update([ParkingRenter], Result(ParkingRenter, Message), (payload) => {
        const renterOpt = renterStorage.get(payload.id);
        if ("None" in renterOpt) {
            return Err({ NotFound: `cannot update the renter: renter with id=${payload.id} not found` });
        }
        renterStorage.insert(renterOpt.Some.id, payload);
        return Ok(payload);
    }),

    removeVehicle: update([text], Result(Vehicle, Message), (id) => {
        const vehicleOpt = vehicleStorage.get(id);
        if ("None" in vehicleOpt) {
            return Err({ NotFound: `Vehicle with id=${id} not found` });
        }
        vehicleStorage.remove(id);
        return Ok(vehicleOpt.Some);
    }),

    removeParkingSpot: update([text], Result(ParkingSpot, Message), (id) => {
        const parkingSpotOpt = parkingStorage.get(id);
        if ("None" in parkingSpotOpt) {
            return Err({ NotFound: `Parking spot with id=${id} not found` });
        }
        parkingStorage.remove(id);
        return Ok(parkingSpotOpt.Some);
    }),

    removeRenter: update([text], Result(ParkingRenter, Message), (id) => {
        const renterOpt = renterStorage.get(id);
        if ("None" in renterOpt) {
            return Err({ NotFound: `Renter with id=${id} not found` });
        }
        renterStorage.remove(id);
        return Ok(renterOpt.Some);
    }),

    reserveParkingSpot: update([text, nat64, nat64], Result(Reserve, Message), async (parkingSpotId, rentPrice, rentPeriod) => {
        const id = ic.caller();
        const memo = hashCode(ic.time().toString() + id.toString()) as nat64;
        const reserve: Reserve = {
            parkingSpotId: parkingSpotId,
            price: rentPrice,
            reservor: id,
            paid_at_block: None,
            status: { PaymentPending: parkingSpotId },
            memo: memo,
        };
        pendingReserves.insert(memo, reserve);
        const response = await icpCanister.transfer({
            memo,
            amount: {
                e8s: rentPrice,
            },
            fee: {
                e8s: 10_000,
            },
            from_subaccount: None,
            to: binaryAddressFromPrincipal(ic.id()),
            created_at_time: Opt.None,
        });

        if ("Err" in response) {
            pendingReserves.remove(memo);
            return Err({ PaymentFailed: "Payment failed" });
        }

        reserve.paid_at_block = Some(response.Ok.block_height);
        reserve.status = { Completed: parkingSpotId };

        const parkingSpotOpt = parkingStorage.get(parkingSpotId);
        if ("None" in parkingSpotOpt) {
            return Err({ NotFound: `Parking spot with id=${parkingSpotId} not found` });
        }

        if (parkingSpotOpt.Some.state !== "open") {
            return Err({ InvalidPayload: "Parking spot is already rented" });
        }

        parkingSpotOpt.Some.state = "reserved";
        parkingSpotOpt.Some.renter = Some(id.toString());
        parkingStorage.insert(parkingSpotId, parkingSpotOpt.Some);

        persistedReserves.insert(id, reserve);
        pendingReserves.remove(memo);
        return Ok(reserve);
    }),

    checkReserveStatus: query([Principal], Result(Reserve, Message), (id) => {
        const reserveOpt = persistedReserves.get(id);
        if ("None" in reserveOpt) {
            return Err({ NotFound: `Reserve with id=${id} not found` });
        }
        return Ok(reserveOpt.Some);
    }),

    getAllReserves: query([], Vec(Reserve), () => {
        return persistedReserves.values();
    }),

    clearPendingReserves: update([], bool, () => {
        const currentTime = ic.time();
        pendingReserves.keys().forEach((key) => {
            const reserveOpt = pendingReserves.get(key);
            if ("Some" in reserveOpt && reserveOpt.Some.status.PaymentPending && currentTime > (reserveOpt.Some.paid_at_block + Duration.fromSecs(TIMEOUT_PERIOD))) {
                pendingReserves.remove(key);
            }
        });
        return true;
    })
});
