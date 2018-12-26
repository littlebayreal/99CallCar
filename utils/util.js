const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function Rad(d) {
  return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
}
//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function GetDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // 地球半径，千米;
  s = Math.round(s * 10000) / 10000; //输出为公里
  // s = Math.round(s * 1000) / 1; //单位修改为米,取整
  //s=s.toFixed(4);
  return s;
}
//根据中心点经纬度 以及半径距离 计算矩形的四个点坐标
const EARTH_RADIUS = 6371;

function returnLLSquarePoint(clng, clat, distance) {
  var dLongitude = 2 * (Math.asin(Math.sin(distance /
    (2 * EARTH_RADIUS)) / Math.cos(Math.toRadians(clat))));
  dLongitude = Math.toDegrees(dLongitude);
  // 计算纬度角度
  var dLatitude = distance / EARTH_RADIUS;
  dLatitude = Math.toDegrees(dLatitude);
  var leftTopPoint = [clat + dLatitude, clng - dLongitude];
  var rightTopPoint = [clat + dLatitude, clng + dLongitude];
  var leftBottomPoint = [clat - dLatitude, clng - dLongitude];
  var rightBottomPoint = [clat - dLatitude, clng + dLongitude];
  return [leftTopPoint,rightTopPoint,leftBottomPoint,rightBottomPoint]
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  getDistance: GetDistance
}