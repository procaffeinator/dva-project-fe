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
