// Dashboard 1 Morris-chart

Morris.Area({
        element: 'morris-area-chart',
        data: [{
            period: '2012',
            Python: 0,
            PHP: 0,
            Java: 0
        }, {
            period: '2013',
            Python: 100,
            PHP: 80,
            Java: 65
        }, {
            period: '2014',
            Python: 180,
            PHP: 150,
            Java: 120
        }, {
            period: '2015',
            Python: 100,
            PHP: 70,
            Java: 40
        }, {
            period: '2016',
            Python: 180,
            PHP: 150,
            Java: 120
        }, {
            period: '2017',
            Python: 100,
            PHP: 70,
            Java: 40
        },
         {
            period: '2018',
            Python: 180,
            PHP: 150,
            Java: 120
        }],
        xkey: 'period',
        ykeys: ['Python', 'PHP', 'Java'],
        labels: ['Python', 'PHP', 'Java'],
        pointSize: 0,
        fillOpacity: 0.99,
        pointStrokeColors:['#65b12d', '#933EC5 ', '#006DF0'],
        behaveLikeLine: true,
        gridLineColor: '#e0e0e0',
        lineWidth:0,
        hideHover: 'auto',
        lineColors: ['#65b12d', '#933EC5 ', '#006DF0'],
        resize: true
        
    });
	
/*Morris.Area({
        element: 'extra-area-chart',
        data: [{
            date: '2010',
            TOTAL: 50,
            Successful: 80,
            Failed: 20
        }, {
            date: '2011',
            TOTAL: 130,
            Successful: 100,
            Failed: 80
        }, {
            date: '2012',
            TOTAL: 80,
            Successful: 60,
            Failed: 70
        }, {
            date: '2013',
            TOTAL: 70,
            Successful: 200,
            Failed: 140
        }, {
            date: '2014',
            TOTAL: 180,
            Successful: 150,
            Failed: 140
        }, {
            date: '2015',
            TOTAL: 105,
            Successful: 100,
            Failed: 80
        },
         {
            date: '2016',
            TOTAL: 250,
            Successful: 150,
            Failed: 200
        }],
        xkey: 'date',
        ykeys: ['TOTAL', 'Successful', 'Failed'],
        labels: ['TOTAL', 'Successful', 'Failed'],
        pointSize: 3,
        fillOpacity: 0,
        pointStrokeColors:['#006DF0', '#933EC5', '#65b12d'],
        behaveLikeLine: true,
        gridLineColor: '#e0e0e0',
        lineWidth: 1,
        hideHover: 'auto',
        lineColors: ['#006DF0', '#933EC5', '#65b12d'],
        resize: true
        
    });*/

    Morris.Area({
        element: 'extra-area-chart',
        data: [], // Initialize with an empty array
        xkey: 'date',
        ykeys: ['TOTAL', 'Successful', 'Failed'],
        labels: ['TOTAL', 'Successful', 'Failed'],
        pointSize: 3,
        fillOpacity: 0,
        pointStrokeColors: ['#006DF0', '#65b12d', '#ff5858'],
        behaveLikeLine: true,
        gridLineColor: '#e0e0e0',
        lineWidth: 1,
        hideHover: 'auto',
        lineColors: ['#006DF0', '#65b12d', '#ff5858'],
        resize: true
    });
    
    // Calling the API
    fetch('http://localhost:3001/request-per-day', {
        method: 'GET',
        mode: 'cors',
      })
      .then((response) => response.json())
      .then((data) => {
        // Replace hardcoded values with API response
        const chartData = data.map((item) => {
          return {
            date: item.date,
            TOTAL: item.total,
            Successful: item.success,
            Failed: item.failed || 0 // Ensure Failed has a default value if missing
          };
        });
    
        // Update the chart with API response
        Morris.Area({
          element: 'extra-area-chart',
          data: chartData,
          xkey: 'date',
          ykeys: ['TOTAL', 'Successful', 'Failed'],
          labels: ['TOTAL', 'Successful', 'Failed'],
          pointSize: 3,
          fillOpacity: 0,
          pointStrokeColors: ['#006DF0', '#65b12d', '#ff5858'],
          behaveLikeLine: true,
          gridLineColor: '#e0e0e0',
          lineWidth: 1,
          hideHover: 'auto',
          lineColors: ['#006DF0', '#65b12d', '#ff5858'],
          resize: true
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });