import { DateProvider } from '../../providers/date/date';
import { UserBodyInfo } from '../../models/user-model';


export class PrepareBodyInfo {
  dateProvider: DateProvider;
  BODY_INFO_LIST: Array<UserBodyInfo>;

  constructor() {
    this.dateProvider = new DateProvider();
  }

  setBodyInfoList(list) {
    this.BODY_INFO_LIST = list;
  }

  getTimeLabels() {
    let timeLabels = [];
    this.BODY_INFO_LIST.forEach(timeValue => {
      timeLabels.push(
        this.dateProvider.getDateChartLabel(timeValue.dateTaken)
      );
    });
    return timeLabels;
  }

  private _getData(dataset: any) {
    let minValue;
    let maxValue;
    let keys = Object.keys(dataset);
    this.BODY_INFO_LIST.forEach(bodyInfo => {
      keys.forEach(key => {
        let value = parseFloat(bodyInfo[key]);
        dataset[key].data.push(value);

        if (minValue === undefined && maxValue === undefined) {
          minValue = value;
          maxValue = value;
        }

        minValue = value < minValue ? value : minValue;
        maxValue = value > maxValue ? value : maxValue;
      });
    });

    let allowance = (maxValue - minValue) / 10;
    dataset.minValue = Math.floor(minValue - allowance);
    dataset.maxValue = Math.ceil(maxValue + allowance);
    return dataset;
  }

  getAgeData() {
    let dataset = {
      trueAge: {
        label: 'Age',
        data: []
      },
      bodyAge: {
        label: 'Body Age',
        data: []
      }
    }

    return this._getData(dataset);
  }

  getHeightData() {
    let dataset = {
      height: {
        label: 'Height',
        data: []
      }
    }

    return this._getData(dataset);
  }

  getWeightAndBMIData() {
    let dataset = {
      weight: {
        label: 'Weight',
        data: []
      },
      bmi: {
        label: 'Body Mass Index',
        data: []
      }
    }

    return this._getData(dataset);
  }

  getRestingMetabolismData() {
    let dataset = {
      restingMetabolism: {
        label: 'Resting Metabolism',
        data: []
      }
    }

    return this._getData(dataset);
  }

  getVisceralFatRatingData() {
    let dataset = {
      visceralFatRating: {
        label: 'Visceral Fat Rating',
        data: []
      }
    }

    return this._getData(dataset);
  }

  getFatPercentageData() {
    let dataset = {
      percBodyFat: {
        label: 'Body Fat Percentage',
        data: []
      },
      subCutFatArms: {
        label: 'Arms',
        data: []
      },
      subCutFatLegs: {
        label: 'Legs',
        data: []
      },
      subCutFatTotal: {
        label: 'Total',
        data: []
      },
      subCutFatTrunk: {
        label: 'Trunk',
        data: []
      }
    }

    return this._getData(dataset);
  }

  getSkeletalMuscleData() {
    let dataset = {
      skeletalMuscleArms: {
        label: 'Arms',
        data: []
      },
      skeletalMuscleLegs: {
        label: 'Legs',
        data: []
      },
      skeletalMuscleTotal: {
        label: 'Total',
        data: []
      },
      skeletalMuscleTrunk: {
        label: 'Trunk',
        data: []
      }
    }

    return this._getData(dataset);
  }
}

const SAMPLE_BODY_INFO_LIST = [
    {
        "uid": "uTRFEXSCPOXoMe5bzrK4",
        "dateTaken": new Date("2018-07-01T13:39:09.863Z"),
        "trueAge": 23,
        "bodyAge": "23",
        "weight": "55",
        "height": "163",
        "visceralFatRating": "2",
        "restingMetabolism": "1227",
        "bmi": "20.7",
        "percBodyFat": "22.7",
        "subCutFatTotal": "20.8",
        "subCutFatTrunk": "16.8",
        "subCutFatArms": "33.6",
        "subCutFatLegs": "30.6",
        "skeletalMuscleTotal": "29.4",
        "skeletalMuscleTrunk": "24.1",
        "skeletalMuscleArms": "32.9",
        "skeletalMuscleLegs": "42.4",
    },
    {
        "uid": "uTRFEXSCPOXoMe5bzrK4",
        "dateTaken": new Date("2018-08-01T13:39:09.863Z"),
        "trueAge": 23,
        "bodyAge": "23",
        "weight": "54.6",
        "height": "163",
        "visceralFatRating": "2",
        "restingMetabolism": "1250",
        "bmi": "20.6",
        "percBodyFat": "22",
        "subCutFatTotal": "20",
        "subCutFatTrunk": "16",
        "subCutFatArms": "33",
        "subCutFatLegs": "30",
        "skeletalMuscleTotal": "29.8",
        "skeletalMuscleTrunk": "24.9",
        "skeletalMuscleArms": "33.7",
        "skeletalMuscleLegs": "43.2",
    },
    {
        "uid": "uTRFEXSCPOXoMe5bzrK4",
        "dateTaken": new Date("2018-09-01T13:39:09.863Z"),
        "trueAge": 23,
        "bodyAge": "22",
        "weight": "54",
        "height": "163",
        "visceralFatRating": "2",
        "restingMetabolism": "1300",
        "bmi": "20.3",
        "percBodyFat": "21",
        "subCutFatTotal": "19.5",
        "subCutFatTrunk": "15.5",
        "subCutFatArms": "32",
        "subCutFatLegs": "27",
        "skeletalMuscleTotal": "30",
        "skeletalMuscleTrunk": "26",
        "skeletalMuscleArms": "34",
        "skeletalMuscleLegs": "44",
    },
    {
        "uid": "uTRFEXSCPOXoMe5bzrK4",
        "dateTaken": new Date("2018-10-01T13:39:09.863Z"),
        "trueAge": 23,
        "bodyAge": "22",
        "weight": "53.9",
        "height": "163",
        "visceralFatRating": "2",
        "restingMetabolism": "1400",
        "bmi": "20.3",
        "percBodyFat": "20",
        "subCutFatTotal": "19",
        "subCutFatTrunk": "15",
        "subCutFatArms": "31.5",
        "subCutFatLegs": "26.5",
        "skeletalMuscleTotal": "30",
        "skeletalMuscleTrunk": "26",
        "skeletalMuscleArms": "34",
        "skeletalMuscleLegs": "44",
    },
];
