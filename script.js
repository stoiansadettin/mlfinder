const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');

  // Cauta reteta folosind fetch API
function cautaReteta(e) {
  e.preventDefault();
  // Stergem elementul cu detalii despre reteta 
  single_mealEl.innerHTML = '';

  // salvam inputul scris de user 
  const term = search.value;

  // ne asiguram ca nu are spatii inainte si dupa 
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Rezultatele pentru: '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>Nici un rezultat pentru ${term}. Incearca din nou cu un alt cuvant  !<p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `
            )
            .join('');
        }
      });
    // curatam inputul
    search.value = '';
  } else {
    alert('Scrie numele unei retete');
  }
}

// Fetch meal by ID
function cautaReteaDupaID(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      adaugaRetata(meal);
    });
}

// Fetch random meal from API
function cautaRetetaRandom() {
  // Clear meals and heading
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Add meal to DOM
function adaugaRetata(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }


  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingrediente</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
  single_mealEl.scrollIntoView()
}

// Event listeners
submit.addEventListener('submit', cautaReteta);
random.addEventListener('click', cautaRetetaRandom);

mealsEl.addEventListener('click', e => {
  const mealInfo = e.target.closest('.meal').querySelector('.meal-info');

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    cautaReteaDupaID(mealID);
  }else {
    alert('Nici o reteta disponibila momentan')
  }
});
