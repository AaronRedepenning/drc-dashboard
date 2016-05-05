export const temperatureChartOptions: Chartist.ILineChartOptions = { 
        axisX: {
            showLabel: false
        },
        fullWidth: true,
        showArea: true,
        showPoint: false,
        plugins: [
            Chartist.plugins.ctAxisTitle({
                axisX: {
                    axisTitle: 'Time (seconds)',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: 20
                    },
                    textAnchor: 'middle'
                },
                axisY: {
                    axisTitle: 'Temperature (°F)',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: -35,
                        y: 0
                    },
                    flipTitle: false
                }
            })
        ]
    };
    
    export const humidityChartOptions: Chartist.ILineChartOptions = { 
        axisX: {
            showLabel: false
        },
        fullWidth: true,
        showArea: true,
        showPoint: false,
        plugins: [
            Chartist.plugins.ctAxisTitle({
                axisX: {
                    axisTitle: 'Time (seconds)',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: 20
                    },
                    textAnchor: 'middle'
                },
                axisY: {
                    axisTitle: 'Humidity (%RH)',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: -35,
                        y: 0
                    },
                    flipTitle: false
                }
            })
        ]
    };
    
    export const pressureChartOptions: Chartist.ILineChartOptions = { 
        axisX: {
            showLabel: false
        },
        fullWidth: true,
        showArea: true,
        showPoint: false,
        plugins: [
            Chartist.plugins.ctAxisTitle({
                axisX: {
                    axisTitle: 'Time (seconds)',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: 20
                    },
                    textAnchor: 'middle'
                },
                axisY: {
                    axisTitle: 'Pressure (hPa)',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: -35,
                        y: 0
                    },
                    flipTitle: false
                }
            })
        ]
    };
    
    export const lightChartOptions: Chartist.ILineChartOptions = { 
        axisX: {
            showLabel: false
        },
        fullWidth: true,
        showArea: true,
        showPoint: false,
        plugins: [
            Chartist.plugins.ctAxisTitle({
                axisX: {
                    axisTitle: 'Time (seconds)',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: 20
                    },
                    textAnchor: 'middle'
                },
                axisY: {
                    axisTitle: 'Light Intensity (lux)',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: -35,
                        y: 0
                    },
                    flipTitle: false
                }
            })
        ]
    };