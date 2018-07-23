let clientArray=[];
            let symptomArray=[];
            let issueArray=[];
            const incidents = {{{stringify incidents}}}
            incidents.forEach(incident =>{
                clientArray.push(incident.clients.name);
                //console.log(clientArray);
            })
            incidents.forEach(incident =>{
                symptomArray.push(incident.symptoms.name);
                //console.log(symptomArray);
            })
            incidents.forEach(incident =>{
                issueArray.push(incident.issues.name);
                //console.log(issueArray);
            })   
            let clients = {{{stringify incidents}}};
            const occurence = (array) =>{
                let result = {};

                if (array instanceof Array){
                    array.forEach((v,i)=>{
                        if (!result[v]){
                            result[v] = [i];
                        } else {
                            result[v].push(i);
                        }
                    });
                }
                return result;
            };
            console.log(occurence(clientArray));
            console.log(occurence(symptomArray));
            console.log(occurence(issueArray));
            let clientLengthArray = occurence(clientArray);
            console.log(clientLengthArray);
            const ctx = document.getElementById("decathlon").getContext('2d');
            /*clients.forEach(client =>{
                clientArray.push(client.name);
                console.log("new client: ",client.name);
            });*/

            function getRandomColor() {
                var letters = '0123456789ABCDEF';
                var color = '#';

                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }

                return color;
            }
            let colorArray = [];
            for(var i = 0; i < clientArray.length; i++){
                colorArray.push(getRandomColor());
            }
            console.log(colorArray);
            let myChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: clientArray,
                    datasets: [{
                        label: '# of Votes',
                        data:['1','10','5','6','7','8'],
                        backgroundColor: colorArray,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true                                }
                        }]
                    }
                }
            });