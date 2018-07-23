import { Component, ViewChild, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { User } from '../../models/user-model';
import { BodyInfoProvider } from '../../providers/body-info/body-info';
import { PrepareBodyInfo } from './prepare-body-info-data';


const PALLETE = {
  'red': '#e74c3c',
  'blue': '#3498db',
  'yellow': '#f1c40f',
  'green': '#2ecc71',
  'ultramarine': '#34495e',
  'purple': '#9b59b6',
}


@Component({
  selector: 'fitness-parameters-chart-view',
  templateUrl: 'fitness-parameters-chart-view.html'
})
export class FitnessParametersChartViewComponent {
  @Input() user: User;

  @ViewChild('slides') slides;
  @ViewChild('ageCanvas') ageCanvas;
  @ViewChild('heightCanvas') heightCanvas;
  @ViewChild('weightAndBMICanvas') weightAndBMICanvas;
  @ViewChild('restingMetabolismCanvas') restingMetabolismCanvas;
  @ViewChild('visceralFatRatingCanvas') visceralFatRatingCanvas;
  @ViewChild('fatPercentageCanvas') fatPercentageCanvas;
  @ViewChild('skeletalMuscleCanvas') skeletalMuscleCanvas;

  ageChart: Chart;
  heightChart: Chart;
  weightAndBMIChart: Chart;
  restingMetabolismChart: Chart;
  visceralFatRatingChart: Chart;
  fatPercentageChart: Chart;
  skeletalMuscleChart: Chart;

  timeLabels: Array<string>;
  bodyInfoList: any;
  loading: boolean = true;

  prepareBodyInfo: PrepareBodyInfo;

  constructor(
    private bodyInfoProvider: BodyInfoProvider,
  ) {
    this.prepareBodyInfo = new PrepareBodyInfo();
    Chart.defaults.global.elements.line.fill = false;
  }

  ngOnInit() {
    this.loadBodyInfoList(this.user);
  }

  loadBodyInfoList(user: User) {
    this.bodyInfoProvider.getAllBodyInfoForUser(user)
      .then(bodyInfoList => {
        this.bodyInfoList = bodyInfoList;
        this.loadGraphs();
      });
  }

  loadGraphs() {
    this.prepareBodyInfo.setBodyInfoList(this.bodyInfoList);
    this.timeLabels = this.prepareBodyInfo.getTimeLabels();
    this.buildAgeChart();
    this.buildHeightChart();
    this.buildWeightAndBMIChart();
    this.buildRestingMetabolismChart();
    this.buildVisceralFatRatingChart();
    this.buildFatPercentageChart();
    this.buildSkeletalMuscleChart();
    this.loading = false;
  }

  buildAgeChart() {
    let dataset = this.prepareBodyInfo.getAgeData();
    this.ageChart = new Chart(this.ageCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.timeLabels,
        datasets: [
          {
            label: dataset.trueAge.label,
            data: dataset.trueAge.data,
            borderColor: PALLETE['red'],
          },
          {
            label: dataset.bodyAge.label,
            data: dataset.bodyAge.data,
            borderColor: PALLETE['blue'],
          },
        ]
      },
      options: {
        title: {
          display: true,
          fontSize: 16,
          fontFamily: 'Roboto',
          text: 'Age and Body Age Comparison'
        },
        scales: {
          yAxes: [{
            ticks: {
              max: dataset.maxValue,
            },
            gridLines: {
              tickMarkLength: 5,
            }
          }]
        },
        legend: {
          position: 'bottom',
        },
      }
    });
  }

  buildHeightChart() {
    let dataset = this.prepareBodyInfo.getHeightData();
    this.heightChart = new Chart(this.heightCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.timeLabels,
        datasets: [
          {
            label: dataset.height.label,
            data: dataset.height.data,
            borderColor: PALLETE['green'],
          },
        ]
      },
      options: {
        title: {
          display: true,
          fontFamily: 'Roboto',
          fontSize: 16,
          text: 'Height'
        },
        legend: {
          position: 'bottom',
        },
      },
    });
  }

  buildWeightAndBMIChart() {
    let dataset = this.prepareBodyInfo.getWeightAndBMIData();
    this.weightAndBMIChart = new Chart(this.weightAndBMICanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.timeLabels,
        datasets: [
          {
            label: dataset.weight.label,
            data: dataset.weight.data,
            borderColor: PALLETE['green'],
            yAxisID: 'weight',
          },
          {
            label: dataset.bmi.label,
            data: dataset.bmi.data,
            yAxisID: 'bmi',
            borderColor: PALLETE['purple'],
          },
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Weight and Body Mass Index',
          fontFamily: 'Roboto',
          fontSize: 16,
        },
        scales: {
          yAxes: [
            {
              id: 'weight',
              position: 'left',
              type: 'linear',
              scaleLabel: {
                display: true,
                labelString: 'Weight',
              }
            },
            {
              id: 'bmi',
              position: 'right',
              type: 'linear',
              scaleLabel: {
                display: true,
                labelString: 'Body Mass Index',
              }
            }
          ]
        },
        legend: {
          position: 'bottom',
        },
      }
    });
  }

  buildRestingMetabolismChart() {
    let dataset = this.prepareBodyInfo.getRestingMetabolismData();
    this.restingMetabolismChart = new Chart(this.restingMetabolismCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.timeLabels,
        datasets: [
          {
            label: dataset.restingMetabolism.label,
            data: dataset.restingMetabolism.data,
            borderColor: PALLETE['red'],
          },
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Resting Metabolism',
          fontFamily: 'Roboto',
          fontSize: 16,
        },
        legend: {
          position: 'bottom',
        },
      }
    });
  }

  buildVisceralFatRatingChart() {
    let dataset = this.prepareBodyInfo.getVisceralFatRatingData();
    this.visceralFatRatingChart = new Chart(this.visceralFatRatingCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.timeLabels,
        datasets: [
          {
            label: dataset.visceralFatRating.label,
            data: dataset.visceralFatRating.data,
            borderColor: PALLETE['blue'],
          },
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Visceral Fat Rating',
          fontFamily: 'Roboto',
          fontSize: 16,
        },
        legend: {
          position: 'bottom',
        },
      }
    });
  }

  buildFatPercentageChart() {
    let dataset = this.prepareBodyInfo.getFatPercentageData();
    this.fatPercentageChart = new Chart(this.fatPercentageCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.timeLabels,
        datasets: [
          {
            label: dataset.percBodyFat.label,
            data: dataset.percBodyFat.data,
            borderColor: PALLETE['purple'],
          },
          {
            label: dataset.subCutFatTotal.label,
            data: dataset.subCutFatTotal.data,
            borderColor: PALLETE['red'],
          },
          {
            label: dataset.subCutFatTrunk.label,
            data: dataset.subCutFatTrunk.data,
            borderColor: PALLETE['blue'],
          },
          {
            label: dataset.subCutFatArms.label,
            data: dataset.subCutFatArms.data,
            borderColor: PALLETE['yellow'],
          },
          {
            label: dataset.subCutFatLegs.label,
            data: dataset.subCutFatLegs.data,
            borderColor: PALLETE['green'],
          },
        ]
      },
      options: {
        title: {
          text: 'Body Fat Data',
          fontFamily: 'Roboto',
          fontSize: 16,
          display: true,
        },
        legend: {
          position: 'bottom',
        },
      }
    });
  }

  buildSkeletalMuscleChart() {
    let dataset = this.prepareBodyInfo.getSkeletalMuscleData();
    this.skeletalMuscleChart = new Chart(this.skeletalMuscleCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.timeLabels,
        datasets: [
          {
            label: dataset.skeletalMuscleTotal.label,
            data: dataset.skeletalMuscleTotal.data,
            borderColor: PALLETE['red'],
          },
          {
            label: dataset.skeletalMuscleTrunk.label,
            data: dataset.skeletalMuscleTrunk.data,
            borderColor: PALLETE['blue'],
          },
          {
            label: dataset.skeletalMuscleArms.label,
            data: dataset.skeletalMuscleArms.data,
            borderColor: PALLETE['green'],
          },
          {
            label: dataset.skeletalMuscleLegs.label,
            data: dataset.skeletalMuscleLegs.data,
            borderColor: PALLETE['yellow'],
          },
        ]
      },
      options: {
        title: {
          text: 'Skeletal Muscle Percentage',
          fontFamily: 'Roboto',
          fontSize: 16,
          display: true,
        },
        legend: {
          position: 'bottom',
        },
      }
    });
  }
}
