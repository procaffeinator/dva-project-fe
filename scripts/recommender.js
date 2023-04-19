const response = [
    {
        "id": 1,
        "name": "Best Lemonade",
        "author_name": "Stephen Little",
        "cook_time": "PT5M",
        "prep_time": "PT30M",
        "recipe_category": "Beverages",
        "ingredients": [
            "sugar",
            "lemons, rind of",
            "lemon, zest of",
            "fresh water",
            "fresh lemon juice"
        ],
        "keywords": "< 60 Mins",
        "calories": 311.1,
        "fat_content": 0.2,
        "saturated_fat_content": 0.0,
        "cholestrol_content": 0.0,
        "sodium_content": 1.8,
        "carbohydrate_content": 81.5,
        "fiber_content": 0.4,
        "sugar_content": 77.2,
        "protein_content": 0.3,
        "recipe_servings": 4,
        "recipe_yield": 1,
        "recipe_instructions": [
            "Into a 1 quart Jar with tight fitting lid, put sugar and lemon peel, or zest;  add 1 1/2 cups very hot water (not from tap!). With lid fitted firmly, shake jar until sugar is dissolved.",
            "Add lemon juice. Refrigerate until chilled.",
            "To Serve: Into each 12-ounce glass, over ice cubes, pour 1/4 cup of the lemon syrup.",
            "Then add chilled club soda or, if you prefer, water.",
            "Stir to mix well."
        ],
        "image": "assets/N.png"
    },
    {
        "id": 2,
        "name": "Cabbage Soup",
        "author_name": "Duckie067",
        "cook_time": "PT30M",
        "prep_time": "PT20M",
        "recipe_category": "Vegetable",
        "ingredients": [
            "plain tomato juice",
            "cabbage",
            "onion",
            "carrots",
            "celery"
        ],
        "keywords": "Easy",
        "calories": 103.6,
        "fat_content": 0.4,
        "saturated_fat_content": 0.1,
        "cholestrol_content": 0.0,
        "sodium_content": 959.3,
        "carbohydrate_content": 25.1,
        "fiber_content": 4.8,
        "sugar_content": 17.7,
        "protein_content": 4.3,
        "recipe_servings": 4,
        "recipe_yield": 1,
        "recipe_instructions": [
            "Mix everything together and bring to a boil.",
            "Reduce heat and simmer for 30 minutes (longer if you prefer your veggies to be soft).",
            "Refrigerate until cool.",
            "Serve chilled with sour cream."
        ],
        "image": "assets/N.png"
    },
    {
        "id": 3,
        "name": "Warm Chicken A La King",
        "author_name": "Joan Edington",
        "cook_time": "PT3M",
        "prep_time": "PT35M",
        "recipe_category": "Chicken",
        "ingredients": [
            "chicken",
            "butter",
            "flour",
            "milk",
            "celery",
            "button mushrooms",
            "green pepper",
            "canned pimiento",
            "salt",
            "black pepper",
            "Worcestershire sauce",
            "parsley"
        ],
        "keywords": "< 60 Mins",
        "calories": 895.5,
        "fat_content": 66.8,
        "saturated_fat_content": 31.9,
        "cholestrol_content": 405.8,
        "sodium_content": 557.2,
        "carbohydrate_content": 29.1,
        "fiber_content": 3.1,
        "sugar_content": 5.0,
        "protein_content": 45.3,
        "recipe_servings": 2,
        "recipe_yield": 1,
        "recipe_instructions": [
            "Melt 1 1/2 ozs butter, add the flour and cook for 2 to 3 minutes, stirring.",
            "Gradually add milk and cook, stirring, until thick and smooth.",
            "Melt the  remaining butter and saute sliced celery, button mushrooms and chopped pepper  until soft but not coloured.",
            "Add celery, mushrooms, pepper, chicken and  pimiento to the sauce and heat through.",
            "Season to taste.  Combine the egg  yolks, double cream and Worcestershire sauce. Add to the chicken mixture and  heat through.",
            "Transfer to a serving dish and sprinkle with chopped parsley."
        ],
        "image": "assets/N.png"
    }
];

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
