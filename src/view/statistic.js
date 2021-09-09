import SmartView from './smart';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {POINT_TYPE, StatisticType} from '../const';
import {formatStatisticValue, getStatistic} from '../utils/common';

const BAR_HEIGHT = 55;
const LINE_COUNT = POINT_TYPE.length;
const CART_HEIGHT = BAR_HEIGHT * LINE_COUNT;

const StatisticText = {
  MONEY: 'MONEY',
  TYPE: 'TYPE',
  TIME: 'TIME-SPEND',
};

const renderChart = (container, type, statistic) => (
  new Chart(container, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: [...statistic.keys()].map((key) => key.toUpperCase()),
      datasets: [{
        data: [...statistic.values()],
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (value) => formatStatisticValue(type, value),
        },
      },
      title: {
        display: true,
        text: StatisticText[type],
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  })
);

const createStatisticTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
    </div>
  </section>`
);

export default class Statistic extends SmartView {
  constructor(points) {
    super();

    this._data = getStatistic(points);

    this._moneyCharts = null;
    this._typeCharts = null;
    this._timeCharts = null;

    this._setCharts();
  }

  removeElement() {
    super.removeElement();

    if (this._moneyCharts !== null || this._typeCharts !== null || this._timeCharts !== null) {
      this._moneyCharts = null;
      this._typeCharts = null;
      this._timeCharts = null;
    }
  }

  getTemplate() {
    return createStatisticTemplate();
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    if (this._moneyCharts !== null || this._typeCharts !== null || this._timeCharts !== null) {
      this._moneyCharts = null;
      this._typeCharts = null;
      this._timeCharts = null;
    }

    const moneyContainer = this.getElement().querySelector('#money');
    const typeContainer = this.getElement().querySelector('#type');
    const timeContainer = this.getElement().querySelector('#time-spend');

    moneyContainer.height = CART_HEIGHT;
    typeContainer.height = CART_HEIGHT;
    timeContainer.height = CART_HEIGHT;

    this._moneyCart = renderChart(moneyContainer, StatisticType.MONEY, this._data[StatisticType.MONEY]);
    this._typeCart = renderChart(typeContainer, StatisticType.TYPE, this._data[StatisticType.TYPE]);
    this._timeCart = renderChart(timeContainer, StatisticType.TIME, this._data[StatisticType.TIME]);
  }
}
