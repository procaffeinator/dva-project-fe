let response;

fetch('data/response.json')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok');
    })
    .then(data => {
        response = data;
        // use the response
        console.log(response);
    })
    .catch(error => {
        // handle the error
        console.error('Error:', error);
    });

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const cardContainer = document.getElementById('card-container');
searchBtn.addEventListener("click", function () {
    // Get the search term from the input
    const searchTerm = searchInput.value.toLowerCase();
    console.log(searchTerm)
    // Call the API with the search term
    // fetch(`https://example.com/api/search?term=${searchTerm}`)
    //     .then(response => response.json())
    //     .then(data => {
    //         // Clear the existing cards
    //         cardContainer.innerHTML = "";
    //         displayCards(response);
    //     });

    cardContainer.innerHTML = "";

    displayCards(response);
    createLineChart(response);
    generateBubbleChart(response);
})


function displayCards(response) {

    response.forEach(item => {
        // Create card element
        const card = document.createElement('div');
        card.classList.add('card');

        // Create card image
        const cardImage = document.createElement('img');
        cardImage.classList.add('card-img-top');
        cardImage.src = item.image;
        cardImage.alt = item.name;
        card.appendChild(cardImage);

        // Create card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Create card title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = item.name;
        cardBody.appendChild(cardTitle);

        // Create card text
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = item.recipe_category;
        cardBody.appendChild(cardText);

        // Create card button
        const cardButton = document.createElement('a');
        cardButton.classList.add('btn', 'btn-primary');
        cardButton.href = '#';
        cardButton.textContent = 'See Detailed View';
        cardBody.appendChild(cardButton);

        // Create nutrient button
        const nutButton = document.createElement('a');
        nutButton.classList.add('btn', 'btn-primary', 'mt-2');
        nutButton.href = '#';
        nutButton.textContent = 'See Nutrient Analysis';
        cardBody.appendChild(nutButton);

        card.appendChild(cardBody);

        // Create modal element
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.tabIndex = -1;
        modal.role = 'dialog';
        modal.setAttribute('aria-labelledby', 'modalTitle');
        modal.setAttribute('aria-modal', true);
        cook_time = parseInt(item.cook_time.substr(2), 10);
        prep_time = parseInt(item.prep_time.substr(2), 10);
        modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalTitle">${item.name}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-6">
                            <h5>Cooking Instructions:</h5>
                            <ul>
                                ${item.recipe_instructions.map(instr => `<li>${instr}</li>`).join('')}
                            </ul>
                            <h5>Cooking Time:</h5>
                            <p>${cook_time} minutes</p>
                            <h5>Prep Time:</h5>
                            <p>${prep_time} minutes</p>
                            
                            <h5>Recipe Servings:</h5>
                            <p>${item.recipe_servings}</p>
                        </div>
                        <div class="col-6">
                            <img class="img-fluid mb-3" src="${item.image}" alt="${item.name}">
                            <h5>Ingredients:</h5>
                            <ul>
                                ${item.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                            </ul>
                            <h5>Calories:</h5>
                            <p>${item.calories}</p>
                        </div>
                    </div>   
                </div>
            </div>
        </div>`;

        // Create nutrient modal element
        const nutModal = document.createElement('div');
        nutModal.classList.add('modal');
        nutModal.tabIndex = -1;
        nutModal.role = 'dialog';
        nutModal.setAttribute('aria-labelledby', 'nutModalTitle');
        nutModal.setAttribute('aria-modal', true);
        nutModal.innerHTML = `
<div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="nutModalTitle">${item.name} Nutrient Analysis</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
    <canvas id="myChart-${item.id}" class="nutrition-chart"></canvas>
</div>
    </div>
</div>`;

        // Append nutrient modal to container
        cardContainer.appendChild(nutModal);

        // Add event listener to show nutrient modal on button click
        nutButton.addEventListener('click', () => {
            nutModal.classList.add('show');
            nutModal.style.display = 'block';
        });

        // Add event listener to hide nutrient modal on close button click or outside click
        const closeNutModal = () => {
            nutModal.classList.remove('show');
            nutModal.style.display = 'none';
        };

        const nutModalCloseBtn = nutModal.querySelector('.close');
        nutModalCloseBtn.addEventListener('click', closeNutModal);

        window.addEventListener('click', (event) => {
            if (event.target === nutModal) {
                closeNutModal();
            }
        });

        let dataArray = [];

        keys = ["fat_content", "saturated_fat_content", "cholestrol_content", "sodium_content", "carbohydrate_content", "fiber_content", "sugar_content", "protein_content"];
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            dataArray.push(item[key]);
        }

        // Get the canvas element
        var ctx = document.getElementById(`myChart-${item.id}`).getContext("2d");


        // Set the data for the chart
        var data = {
            labels: [
                "Fat Content",
                "Saturated Fat Content",
                "Cholesterol Content",
                "Sodium Content",
                "Carbohydrate Content",
                "Fiber Content",
                "Sugar Content",
                "Protein Content"
            ],
            datasets: [
                {
                    label: "Nutrition Data",
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderWidth: 1,
                    data: dataArray
                }
            ]
        };

        min_value = Math.min(...dataArray)
        // Set the options for the chart
        var options = {
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: min_value
                    }
                }]
            }
        };


        // Create the chart
        var myChart = new Chart(ctx, {
            type: "bar",
            data: data,
            options: options
        });

        // Append card and modal to container
        cardContainer.appendChild(card);
        cardContainer.appendChild(modal);

        // Add event listener to show modal on button click
        cardButton.addEventListener('click', () => {
            modal.classList.add('show');
            modal.style.display = 'block';
        });

        // Add event listener to hide modal on close button click or outside click
        const closeModal = () => {
            modal.classList.remove('show');
            modal.style.display = 'none';
        };

        const modalCloseBtn = modal.querySelector('.close');
        modalCloseBtn.addEventListener('click', closeModal);

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    });

}



function generateRandomColor() {
    // Generate a random number for each color component (red, green, blue)
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);

    // Combine the color components into a CSS color string
    var color = "rgba(" + red + ", " + green + ", " + blue + ", 0.4)";

    return color;
}

function createLineChart(response) {
    var chartData = {
        labels: ['Total Fat', 'Saturated Fat', 'Cholesterol', 'Sodium', 'Total Carbohydrates', 'Fiber Content', 'Sugar', 'Protein'],
        datasets: []
    };

    let dataArray = [];

    keys = ["fat_content", "saturated_fat_content", "cholestrol_content", "sodium_content", "carbohydrate_content", "fiber_content", "sugar_content", "protein_content"];
    for (let j = 0; j < response.length; j++) {
        item = response[j];
        data = []
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            data.push(item[key]);
        }
        dataArray.push(data);
    }

    // Loop through the data arrays for each recipe and add them to the chart data
    for (var i = 0; i < dataArray.length; i++) {
        color = generateRandomColor();
        var dataset = {
            label: response[i].name,
            backgroundColor: color,
            borderColor: color,
            pointBackgroundColor: color,
            pointBorderColor: color,
            pointHoverBackgroundColor: color,
            pointHoverBorderColor: color,
            data: dataArray[i]
        };
        chartData.datasets.push(dataset);
    }

    // Set options for the chart
    var options = {
        title: {
            display: true,
            text: 'Nutrient Content Comparison between Recipes',
            fontSize: 36
        },
        scale: {
            ticks: {
                beginAtZero: true,
                maxTicksLimit: 5,
                suggestedMax: 40,
                stepSize: 10
            }
        },
        maintainAspectRatio: true
    };

    // Get the canvas element and create the chart
    var ctx = document.getElementById('myChart1').getContext('2d');
    console.log(ctx)
    var myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: chartData,
        options: options
    });
}

function generateBubbleChart() {

    var data = {
        datasets: []
    };

    // Loop through the recipe data and create a separate dataset for each recipe
    for (var i = 0; i < response.length; i++) {
        var recipe = response[i];
        prep_time = parseInt(recipe.prep_time.substr(2), 10);
        cook_time = parseInt(recipe.cook_time.substr(2), 10)
        var dataset = {
            label: recipe.name,
            backgroundColor: generateRandomColor(),
            data: [{
                x: prep_time,
                y: cook_time,
                r: prep_time + cook_time
            }]
        };
        data.datasets.push(dataset);
    }

    // Set options for the chart
    var options = {
        title: {
            display: true,
            text: 'Recipe Prep Time vs. Cook Time',
            fontSize: 36
        },
        scales: {
            x: {
                ticks: {
                    beginAtZero: true,
                    font: {
                        size: 14
                    }
                }
            },
            y: {
                ticks: {
                    beginAtZero: true,
                    font: {
                        size: 14
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    usePointStyle: true
                }
            }
        },
        datalabels: {
            display: true,
            formatter: function (value, context) {
                return context.dataset.label;
            }
        },
        responsive: true,
        maintainAspectRatio: true,
        layout: {
            padding: {
                left: 100,
                right: 100,
                top: 100,
                bottom: 100
            }
        }
    };

    // Get the canvas element and create the chart
    var ctx = document.getElementById('myChart2').getContext('2d');
    var myBubbleChart = new Chart(ctx, {
        type: 'bubble',
        data: data,
        options: options
    });
    // Add x and y axis labels using JavaScript
    var xLabel = document.createElement('div');
    xLabel.className = 'chart-x-axis-label';
    xLabel.innerText = 'Prep Time (minutes)';
    document.getElementById('myChart2').parentNode.appendChild(xLabel);

    var yLabel = document.createElement('div');
    yLabel.className = 'chart-y-axis-label';
    yLabel.innerText = 'Cook Time (minutes)';
    document.getElementById('myChart2').parentNode.appendChild(yLabel);
}


