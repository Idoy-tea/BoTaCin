const { getDetachSourceFromOHLCV, sma, rsiCheck } = require('trading-indicator');

class Doge {
  constructor(timeFrame) {
    this.timeFrame = timeFrame;
  };

  async getOHLCVData() {
    return getDetachSourceFromOHLCV('binance', 'DOGE/USDT', this.timeFrame, false);
  }

  async getSma(period) {
    const { input } = await this.getOHLCVData();
    let smaData = await sma(period, "close", input);
    return smaData//[smaData.length - 1];
  }

  async getRsiCross() {
    const { input } = await this.getOHLCVData();
    return rsiCheck(14, 70, 30, input);
  }
}

module.exports = Doge;
