import { CreateAdLinkType } from "../types/UiHelperTypes";

const BASE_COST_SMALL = 0.30;
const BASE_COST_MEDIUM = 0.50;
const BASE_COST_LARGE = 1.00;

export const getCalculatedAdCost = (adType: CreateAdLinkType, adSize?: number, daysBooked?: number) => {

    let cost = 0;

    if (adType === "link") {

        if(!adSize || !daysBooked) {
            throw new Error("Missing ad size or days booked");
        }

        if (adSize === 1) {
            cost = BASE_COST_SMALL * daysBooked;
        } else if (adSize === 2) {
            cost = BASE_COST_MEDIUM * daysBooked;
        } else if (adSize === 3) {
            cost = BASE_COST_LARGE * daysBooked;
        } else {
            throw new Error("Invalid ad size");
        }

        return cost;

    } else if (adType === "article") {

        cost = 10;
        return cost;

    }

    throw new Error("Invalid ad type");
}