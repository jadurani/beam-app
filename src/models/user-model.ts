export interface User {
    // Firebase Auth Info
    authId ?: string; // uid from Firebase Auth
    displayName ?: string;
    email ?: string;
    phoneNumber ?: string;
    photoUrl ?: string;

    // Basic Information
    id: string; // Document ID in Firebase
    dateJoined: Date;
    firstName ?: string;
    lastName ?: string;
    suffix ?: string;
    gender ?: string;
    dateOfBirth ?: Date;
    phoneNumbers ?: Array<PhoneNumber>;
    address ?: string;

    // Permission roles
    roles: UserPermissions;

    // Person to contact in case of emergency
    iceContact ?: ICEContact;

    // Fitness Parameters
    bodyInfo ?: UserBodyInfo;

    // Medical history, other preferences
    otherRemarks ?: string;
}

export interface UserBodyInfo {
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
}

export interface PhoneNumber {
    type: string;
    number: string;
};

export interface FirebaseDate {
    seconds: number;
    nanoseconds: number;
}

interface UserPermissions {
    owner ?: boolean,
    staff ?: boolean,
    trainer ?: boolean,
    client ?: boolean,
};

export interface ICEContact {
    name: string;
    phoneNumber: string;
}
