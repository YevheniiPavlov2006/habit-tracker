const preview = document.querySelector('.preview')
setTimeout(() => {
  preview.style.opacity = '0'
}, 1500)
setTimeout(() => {
  preview.style.top = '-200%'
}, 2000)

/*======================*/

const habits = document.getElementById('habits');
const addBtn = document.querySelector('.add-btn');

const emptyMessage = document.createElement('p');
emptyMessage.textContent = 'Add your first habit';
emptyMessage.classList.add('empty-message');
habits.appendChild(emptyMessage);

function updateEmptyMessage() {
  if (habits.querySelector('.habit-card')) {
    emptyMessage.style.display = 'none';
  } else {
    emptyMessage.style.display = 'block';
  }
}

function saveHabits() {
  const habitData = [];
  document.querySelectorAll('.habit-card').forEach(card => {
    const name = card.querySelector('.habit-card-name').textContent;
    const color = card.querySelector('.habit-card-logo').style.backgroundColor;
    const completedDays = Array.from(card.querySelectorAll('.calendar-day.day-active')).map(day => day.textContent);
    habitData.push({ name, color, completedDays });
  });
  localStorage.setItem('habits', JSON.stringify(habitData));
}

function loadHabits() {
  const savedHabits = JSON.parse(localStorage.getItem('habits')) || [];
  savedHabits.forEach(({ name, color, completedDays }) => {
    createHabitCard(name, color, completedDays);
  });
  updateEmptyMessage();
}

function createHabitCard(nameValue, colorValue, completedDays = []) {
  const habit = document.createElement('div');
  habit.classList.add('habit-card');
  
  habit.innerHTML = `
    <div class="habit-card-header">
      <div class="habit-card-logo"></div>
      <div class="habit-card-name">${nameValue}</div>
      <img src="img/icons8-trash.svg" alt="Delete" class="delete-habit">
    </div>
    <div class="habit-card-calendar">
       ${Array.from({ length: 21 }, (_, i) => `<div class="calendar-day ${i === 20 ? 'last' : ''}" data-day="${i + 1}">${i + 1}</div>`).join('')}
    </div>
  `;

  habit.querySelector('.habit-card-logo').style.backgroundColor = colorValue;
  habits.appendChild(habit);

  completedDays.forEach(day => {
    const dayElement = habit.querySelector(`.calendar-day[data-day="${day}"]`);
    if (dayElement) {
      dayElement.classList.add('day-active');
    }
  });

  updateEmptyMessage();
  saveHabits();
}

addBtn.addEventListener('click', function () {
  const createCard = document.querySelector('.create-card-block');
  createCard.style.top = '0';

  const btnCreate = document.querySelector('.create-habit');
  btnCreate.addEventListener('click', () => {
    createCard.style.top = '-100%';

    const name = document.querySelector('.card-name-input');
    const color = document.querySelector('.card-color-input');
    const nameValue = name.value;
    let colorValue = color.value || getRandomColor();
    if(nameValue === '') return;

    createHabitCard(nameValue, colorValue);
    
    name.value = "";
    color.value = "";
  }, { once: true });
});

habits.addEventListener('click', function (event) {
  if (event.target.classList.contains('delete-habit')) {
    event.target.closest('.habit-card').remove();
    saveHabits();
    updateEmptyMessage();
  }
});

habits.addEventListener('click', function (event) {
  if (event.target.classList.contains('calendar-day')) {
    event.target.classList.toggle('day-active');
    saveHabits();

    if (event.target.classList.contains('last') && event.target.classList.contains('day-active')) {
      const block = document.querySelector('.congratulation');
      block.classList.add('congr-show-active');
      setTimeout(() => {
        block.classList.remove('congr-show-active');
      }, 3100);
    }
  }
});

function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

loadHabits();



