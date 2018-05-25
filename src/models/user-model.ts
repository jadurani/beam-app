export class User {
    // Details in Firebase
    id: string; //uid in Firebase
    displayName: string | null;
    email: string | null;
    phoneNumber: string |null;
    photoUrl: string | null;
    dateJoined: Date;

    // Basic Information
    firstName: string | null;
    lastName: string | null;
    suffix: string | null;
    gender: string | null;
    dateOfBirth: Date | null;

    // Permission roles
    roles: {
        owner: boolean | null,
        staff: boolean | null,
        trainer: boolean | null,
        client: boolean | null,
    };

    bodyDetailsArray: Array<UserBodyDetails>;

    constructor(
        id: string,
        displayName: string | null = null,
        email: string | null = null,
        phoneNumber: string | null = null,
        photoUrl: string | null = null)
    {
        if (!id) throw "Provide User ID!";
        this.id = id;

        this.displayName = displayName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.photoUrl = photoUrl;
    }

    public addBodyDetails(bodyDetails: UserBodyDetails): void {
        this.bodyDetailsArray.push(bodyDetails);
    }

    public setBasicInfo(
        firstName: string | null = null,
        lastName: string | null = null,
        suffix: string | null = null,
        gender: string | null = null,
        dateOfBirth: Date | null = null,
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.suffix = suffix;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
    }

}

class UserBodyDetails {
    dateRecorded: Date;
    weight: number; // (kg)
    height: number; // (cm)
    visceralFatRating: number;
    restingMetabolism: number;
    bodyAge: number;

    subcutaneousMeasurements: {
        total: number,
        trunk: number,
        arms: number,
        legs: number
    };

    skeletalMeasurements: {
        total: number,
        trunk: number,
        arms: number,
        legs: number
    };

    constructor(
        dateRecorded: Date,
        weight: number,
        height: number,
        visceralFatRating: number,
        restingMetabolism: number,
        bodyAge: number,
        subcutaneousMeasurements: { total, trunk, arms, legs },
        skeletalMeasurements: { total, trunk, arms, legs },
    ) {
        this.dateRecorded = dateRecorded;
        this.weight = weight;
        this.height = height;
        this.visceralFatRating = visceralFatRating;
        this.restingMetabolism = restingMetabolism;
        this.bodyAge = bodyAge;
        this.subcutaneousMeasurements = subcutaneousMeasurements;
        this.skeletalMeasurements = skeletalMeasurements;
    }
}
