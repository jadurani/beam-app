export class User {
    // Firebase Auth Info
    authId: string | null; // uid from Firebase Auth
    displayName: string | null;
    email: string | null;
    phoneNumber: string |null;
    photoUrl: string | null;

    // Basic Information
    id: string; // Document ID in Firebase
    dateJoined: Date;
    firstName: string | null;
    lastName: string | null;
    suffix: string | null;
    gender: string | null;
    dateOfBirth: Date | null;
    phoneNumbers: Array<PhoneNumber> | null;
    address: string | null;

    // Permission roles
    roles: UserPermissions;

    // Person to contact in case of emergency
    iceContact: ICEContact | null;

    // Fitness Parameters
    bodyInfo: UserBodyInfo | null;

    // Medical history, other preferences
    otherRemarks: string | null;

    constructor(
        id: string,
        dateJoined: FirebaseDate,
        roles: UserPermissions,
    ) {
        if (!id) throw "Provide User ID!";
        this.id = id;

        if (!dateJoined) throw "Provide the date when user joined!";
        this.dateJoined = new Date(dateJoined.seconds * 1000);

        if(!roles) throw "Provide the user's roles!";
        this.roles = roles;
    }

    public setFirebaseAuthInfo (
        authId: string | null = null,
        displayName: string | null = null,
        email: string | null = null,
        phoneNumber: string | null = null,
        photoUrl: string | null = null
    ) {
        this.authId = authId;
        this.displayName = displayName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.photoUrl = photoUrl;
    }

    public setBasicInfo (
        firstName: string | null = null,
        lastName: string | null = null,
        suffix: string | null = null,
        gender: string | null = null,
        dateOfBirth: FirebaseDate | null = null,
        phoneNumbers: Array<PhoneNumber> | null = null,
        address: string | null = null,
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.suffix = suffix;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth ? new Date(dateOfBirth.seconds * 1000) : null;
        this.phoneNumbers = phoneNumbers;
        this.address = address;
    }

    public setFitnessParams (bodyInfo: UserBodyInfo) {
        this.bodyInfo = bodyInfo;
    }

    public setICE (iceContact: ICEContact) {
        this.iceContact = iceContact;
    }

    public setOtherRemarks (remarks: string) {
        this.otherRemarks = remarks;
    }

    public getRoles (): Array<string> {
        return Object.keys(this.roles);
    }
}

export class UserBodyInfo {
    uid: string;
    dateTaken: Date;
    trueAge: number;
    weight: number; // (kg)
    height: number; // (cm)
    percBodyFat: number;
    visceralFatRating: number;
    restingMetabolism: number;
    bmi: number;
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
        uid: string,
        dateTaken: FirebaseDate,
        trueAge: number,
        weight: number,
        height: number,
        percBodyFat: number,
        visceralFatRating: number,
        restingMetabolism: number,
        bodyAge: number,
        bmi: number,
        subcutaneousMeasurements: { total, trunk, arms, legs },
        skeletalMeasurements: { total, trunk, arms, legs },
    ) {
        if (!uid) throw "Provide uid!";
        this.uid = uid;

        if (!dateTaken) throw "Provide dateTaken!";
        this.dateTaken = new Date(dateTaken.seconds
             * 1000);;
        if (!trueAge) throw "Provide trueAge!";
        this.trueAge = trueAge;

        if (!weight) throw "Provide weight!";
        this.weight = weight;

        if (!height) throw "Provide height!";
        this.height = height;

        if (!percBodyFat) throw "Provide percBodyFat!";
        this.percBodyFat = percBodyFat;

        if (!visceralFatRating) throw "Provide visceralFatRating!";
        this.visceralFatRating = visceralFatRating;

        if (!restingMetabolism) throw "Provide restingMetabolism!";
        this.restingMetabolism = restingMetabolism;

        if (!bmi) throw "Provide bmi!";
        this.bmi = bmi;

        if (!bodyAge) throw "Provide bodyAge!";
        this.bodyAge = bodyAge;

        if (!subcutaneousMeasurements) throw "Provide subcutaneousMeasurements!";
        this.subcutaneousMeasurements = subcutaneousMeasurements;

        if (!skeletalMeasurements) throw "Provide skeletalMeasurements!";
        this.skeletalMeasurements = skeletalMeasurements;
    }
}

export interface PhoneNumber {
    type: string;
    number: string;
};

interface FirebaseDate {
    seconds: number;
    nanoseconds: number;
}

interface UserPermissions {
    owner: boolean | null,
    staff: boolean | null,
    trainer: boolean | null,
    client: boolean | null,
};

export interface ICEContact {
    name: string;
    phoneNumber: string;
}
