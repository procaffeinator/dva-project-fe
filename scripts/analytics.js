let response;

function loadData() {
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
            const categories = [...new Set(response.map(recipe => recipe.recipe_category))];
            buildCategoryDropdown(categories);
            buildHeatMap(response, categories[0]);
            console.log(response);
        })
        .catch(error => {
            // handle the error
            console.error('Error:', error);
        });
}


window.onload = function () {
    loadData();
}

const nutrients = ["fat_content", "saturated_fat_content", "cholestrol_content", "sodium_content", "carbohydrate_content", "fiber_content", "sugar_content", "protein_content"];

function buildCategoryDropdown(categories) {
    const select = document.getElementById("category-select");
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.text = category;
        select.add(option);
    });
    select.addEventListener("change", function () {
        currentCategory = this.value;
        buildHeatMap(response, currentCategory);
    });
}

function buildHeatMap(response, category) {
    // Define the nutrients to be used for the heatmap

    const yLabels = [];
    const zValues = [];

    for (let i = 0; i < response.length; i++) {
        const recipe = response[i];
        if (category && recipe.recipe_category !== category) {
            continue;
        }
        yLabels.push(recipe.name);
        const zRow = [];
        for (const nutrient of nutrients) {
            zRow.push(recipe[nutrient]);
        }
        zValues.push(zRow);
    }

    const xLabels = nutrients.map(nutrient => nutrient.split("_")[0].toUpperCase());


    // Define the trace for the heatmap
    const trace = {
        x: xLabels,
        y: yLabels,
        z: zValues,
        type: "heatmap",
        colorscale: [
            [0.1, 'rgb(236,231,242)'],
            [0.2, 'rgb(208,209,230)'],
            [0.3, 'rgb(166,189,219)'],
            [0.4, 'rgb(116,169,207)'],
            [0.5, 'rgb(54,144,192)'],
            [0.6, 'rgb(5,112,176)'],
            [0.7, 'rgb(4,90,141)'],
            [0.8, 'rgb(2,56,88)'],
            [0.9, 'rgb(0,30,55)']
        ], hovertemplate: "%{y}<br>%{x}: %{z}<extra></extra>"
    };

    // Define the layout for the heatmap
    const layout = {
        title: {
            text: "Recipe Nutrient Content",
            font: {
                size: 24
            }
        },
        xaxis: {
            title: "Nutrient",
        },
        yaxis: {
            title: "Recipe",
            tickangle: -45,
            automargin: true
        },
        height: "80vh", // set height to 80% of viewport height
        margin: { t: 80, r: 200, b: 50, l: 250 }, // set margins to create padding
        pad: { t: 0, r: 50, b: 0, l: 80 }, // set padding to 0 to align with canvas
        autosize: true // allow plot to automatically resize to fit canvas

    };

    // Define the data array for the plot
    const plotData = [trace];

    // Define the configuration for the plot
    const config = {
        displayModeBar: false,
        responsive: true
    };

    // Create the heatmap plot
    Plotly.newPlot("heatmap", plotData, layout, config);

}


