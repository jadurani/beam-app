export interface User {
    // Firebase Auth Info
    authId ?: string; // uid from Firebase Auth
    displayName ?: string; //nickName
    email ?: string;
    phoneNumber ?: string;
    photoUrl ?: string;

    // Basic Information
    id ?: string; // Document ID in Firebase
    prefix ?: string;
    fullName ?: string;
    dateJoined ?: Date;
    sex ?: string;
    dateOfBirth ?: Date;
    address ?: Address;
    // address ?: string;

    phoneNumbers ?: Array<PhoneNumber>;
    socialMedia ?: string;

    // Permission roles
    roles: UserPermissions;

    // Person to contact in case of emergency
    iceContact ?: ICEContact;

    // Fitness Parameters
    bodyInfo ?: UserBodyInfo;

    // Medical history, other preferences
    otherRemarks ?: string;

    // Profession / Occupation
    workDetails ?: WorkDetails;
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

    subcutaneousMeasurements?: {
        total: number,
        trunk: number,
        arms: number,
        legs: number
    };

    skeletalMeasurements?: {
        total: number,
        trunk: number,
        arms: number,
        legs: number
    };

    subCutFatArms?: number,
    subCutFatLegs?: number,
    subCutFatTotal?: number,
    subCutFatTrunk?: number,

    skeletalMuscleArms?: number,
    skeletalMuscleLegs?: number,
    skeletalMuscleTotal?: number,
    skeletalMuscleTrunk?: number
}

export interface PhoneNumber {
    number : string;
    label ?: string;

    type ?: string;
};

export interface FirebaseDate {
    seconds: number;
    nanoseconds: number;
}

interface UserPermissions {
    admin ?: boolean;
    owner ?: boolean,
    staff ?: boolean,
    trainer ?: boolean,
    client ?: boolean,
};

export interface ICEContact {
    name : string;
    relationship : string;
    contactNumber : string;
    email ?: string;
    socialMedia ?: string;

    phoneNumber ?: string;
}

export interface Address {
    street ?: string;
    barangay ?: string;
    city : string;
}

export interface WorkDetails {
    title : string;
    company ?: string;
}
