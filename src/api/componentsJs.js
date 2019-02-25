
let timeData;
module.exports = {
	getTimes: {
		dateFtt: function(time) {
	      timeData = time.replace(/T/g,' ').replace(/\.[/d]{3}Z/,'');
	      timeData = timeData.replace(/-/g, '/');
	      let timestamp = Math.round(new Date(timeData).getTime() / 1000);
	      let toTime = Math.round(new Date().getTime() / 1000);
	      let timeDifference = toTime - timestamp;
	      let timeString = '';
	      if(timeDifference < 3600) {
	        timeString = Math.round(timeDifference / 60) + '分钟';
	      }else if(timeDifference >= 3600 && timeDifference < 86400) {
	        timeString = Math.round(timeDifference / 3600) + '小时';
	      }else if(timeDifference >= 86400 && timeDifference < 2629800) {
	        timeString = Math.round(timeDifference / 86400) + '天';
	      }else if(timeDifference >= 2629800 && timeDifference < 31557600) {
	        timeString = Math.round(timeDifference / 2629800) + '月';
	      }else if(timeDifference >= 31557600) {
	        timeString = Math.round(timeDifference / 31557600) + '年';
	      }
	      return timeString;
	    }
	},
	num: '1234'
}